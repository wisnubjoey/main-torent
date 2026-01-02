
## Relations
@frontend/cart_context

The rental cart is stored in the Laravel session under the key 'rental_cart'. It is also synchronized with the browser's sessionStorage to maintain the cart state on the frontend.

---


'"'"'php
// app/Http/Controllers/User/RentalCartController.php

// Initialize cart if not exists
$cart = Session::get('rental_cart', []);

// ...

Session::put('rental_cart', $cart);
'"'"'

---


'"'"'typescript
// resources/js/context/cart-context.tsx

useEffect(() => {
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
'"'"'
