import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ChevronUp, ChevronDown, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { CartItem } from "./cart-item";
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function RentalCart() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCartItems, getCartTotal, getCartCount, clearCart, isLoading } = useCart();
  
  const cartItems = getCartItems();
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    router.get('/checkout');
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  // Don't render if cart is empty
  if (cartCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <AnimatePresence>
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: isExpanded ? -380 : 0 }}
          exit={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-background border-t border-border shadow-lg"
        >
          {/* Cart Header - Always Visible */}
          <div className="bg-primary text-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cart ({cartCount})</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
              
              <div className="flex items-center gap-4">
                <span className="font-semibold">{formatPrice(cartTotal)}</span>
                <Button
                  size="sm"
                  onClick={handleCheckout}
                  disabled={isLoading || cartCount === 0}
                >
                  Checkout
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Cart Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 400 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="h-[400px] overflow-y-auto p-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle>Shopping Cart</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleClearCart}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {cartItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Your cart is empty
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4 max-h-60 overflow-y-auto">
                            {Object.keys(cartItems).map((itemId) => (
                              <CartItem key={itemId} itemId={parseInt(itemId)} />
                            ))}
                          </div>
                          
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Total:</span>
                              <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
