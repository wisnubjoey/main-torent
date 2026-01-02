
## Relations
@cart_management/backend

The `cart-context.tsx` file provides a React Context for managing the rental cart state on the frontend. It synchronizes with sessionStorage and provides functions to interact with the backend cart API.

---

'''typescript
// resources/js/context/cart-context.tsx

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialCart = {} }) => {
  // ... state and effect hooks ...

  const addToCart = async (vehicleId: number) => {
    // ... POST /rental-cart/add ...
  };

  const updateCartItem = async (vehicleId: number, updates: Partial<CartItem>) => {
    // ... POST /rental-cart/update ...
  };

  const removeFromCart = async (vehicleId: number) => {
    // ... POST /rental-cart/remove ...
  };

  // ... other functions ...

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
'''
