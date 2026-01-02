import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export interface CartItem {
  vehicle_id: number;
  vehicle: {
    id: number;
    brand: string;
    model: string;
    production_year: number;
    plate_no: string;
    seat_count: number;
    transmission: string;
    vehicle_class?: string;
    image_url?: string | null;
    price_daily_idr: number;
    price_weekly_idr: number;
    price_monthly_idr: number;
  };
  mode: 'daily' | 'weekly' | 'monthly';
  quantity: number;
  start_at: string;
  end_at?: string;
  price_per_unit_idr?: number;
  subtotal_price_idr?: number;
}

interface CartContextType {
  cart: Record<number, CartItem>;
  isLoading: boolean;
  addToCart: (vehicleId: number) => Promise<void>;
  updateCartItem: (vehicleId: number, updates: Partial<CartItem>) => Promise<void>;
  removeFromCart: (vehicleId: number) => Promise<void>;
  clearCart: () => void;
  isInCart: (vehicleId: number) => boolean;
  getCartItems: () => CartItem[];
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
  initialCart?: Record<number, CartItem>;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialCart = {} }) => {
  const [cart, setCart] = useState<Record<number, CartItem>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialCart && Object.keys(initialCart).length > 0) {
      setCart(initialCart);
      return;
    }
    const storedCart = sessionStorage.getItem('rental_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (error) {
        console.error('Failed to parse cart from session storage:', error);
      }
    }
  }, [initialCart]);

  // Save cart to session storage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('rental_cart', JSON.stringify(cart));
  }, [cart]);

  const calculateEndDate = (startDate: string, mode: 'daily' | 'weekly' | 'monthly', quantity: number): string => {
    const start = new Date(startDate);
    let end = new Date(start);

    switch (mode) {
      case 'daily':
        end.setDate(start.getDate() + quantity);
        break;
      case 'weekly':
        end.setDate(start.getDate() + (7 * quantity));
        break;
      case 'monthly':
        end.setDate(start.getDate() + (30 * quantity));
        break;
    }

    return end.toISOString();
  };

  const calculatePrice = (vehicle: CartItem['vehicle'], mode: 'daily' | 'weekly' | 'monthly'): number => {
    switch (mode) {
      case 'daily':
        return vehicle.price_daily_idr;
      case 'weekly':
        return vehicle.price_weekly_idr;
      case 'monthly':
        return vehicle.price_monthly_idr;
      default:
        return vehicle.price_daily_idr;
    }
  };

  const addToCart = async (vehicleId: number) => {
    if (cart[vehicleId]) {
      toast.error('This vehicle is already in your cart');
      return;
    }

    setIsLoading(true);
    try {
      await router.post(
        '/rental-cart/add',
        { vehicle_id: vehicleId },
        {
          onSuccess: (page) => {
            const newCartItem = page.props.cart?.[vehicleId];
            if (newCartItem) {
              setCart(prev => ({
                ...prev,
                [vehicleId]: newCartItem
              }));
              toast.success('Vehicle added to cart');
            }
          },
          onError: (errors) => {
            toast.error(errors.vehicle_id || 'Failed to add vehicle to cart');
          },
          onFinish: () => {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      setIsLoading(false);
      toast.error('Failed to add vehicle to cart');
    }
  };

  const updateCartItem = async (vehicleId: number, updates: Partial<CartItem>) => {
    const currentItem = cart[vehicleId];
    if (!currentItem) return;

    setIsLoading(true);
    try {
      const startAt = updates.start_at || currentItem.start_at;
      const mode = updates.mode || currentItem.mode;
      const quantity = updates.quantity || currentItem.quantity;

      // Calculate end date and prices
      const endAt = calculateEndDate(startAt, mode, quantity);
      const pricePerUnit = calculatePrice(currentItem.vehicle, mode);
      const subtotal = pricePerUnit * quantity;

      const updatedItem = {
        ...currentItem,
        ...updates,
        end_at: endAt,
        price_per_unit_idr: pricePerUnit,
        subtotal_price_idr: subtotal
      };

      await router.post(
        '/rental-cart/update',
        {
          vehicle_id: vehicleId,
          mode,
          quantity,
          start_at: startAt
        },
        {
          onSuccess: () => {
            setCart(prev => ({
              ...prev,
              [vehicleId]: updatedItem
            }));
            toast.success('Cart updated');
          },
          onError: (errors) => {
            // Map error keys to user-friendly messages
            const errorMessage = Object.values(errors)[0] as string || 'Failed to update cart';
            toast.error(errorMessage);
          },
          onFinish: () => {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error updating cart item:', error);
      setIsLoading(false);
      toast.error('Failed to update cart');
    }
  };

  const removeFromCart = async (vehicleId: number) => {
    setIsLoading(true);
    try {
      await router.post(
        '/rental-cart/remove',
        { vehicle_id: vehicleId },
        {
          onSuccess: () => {
            setCart(prev => {
              const newCart = { ...prev };
              delete newCart[vehicleId];
              return newCart;
            });
            toast.success('Item removed from cart');
          },
          onError: () => {
            toast.error('Failed to remove item from cart');
          },
          onFinish: () => {
            setIsLoading(false);
          }
        }
      );
    } catch (error) {
      console.error('Error removing from cart:', error);
      setIsLoading(false);
      toast.error('Failed to remove item from cart');
    }
  };

  const clearCart = () => {
    setCart({});
    sessionStorage.removeItem('rental_cart');
    toast.success('Cart cleared');
  };

  const isInCart = (vehicleId: number): boolean => {
    return !!cart[vehicleId];
  };

  const getCartItems = (): CartItem[] => {
    return Object.values(cart);
  };

  const getCartTotal = (): number => {
    return Object.values(cart).reduce((total, item) => total + (item.subtotal_price_idr || 0), 0);
  };

  const getCartCount = (): number => {
    return Object.keys(cart).length;
  };

  const value: CartContextType = {
    cart,
    isLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isInCart,
    getCartItems,
    getCartTotal,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
