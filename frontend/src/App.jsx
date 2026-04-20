import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Navbar from './components/Navbar';
import Home from './page/Home';
import Contact from './page/Contact';
import Items from './page/Items';
import Cart from './page/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Logout from './components/Logout';
import CheckoutPage from './components/Checkout';
import MyOrders from './components/OrderPage';
import VerifyPaymentPage from './page/VerifyPaymentPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  // ✅ FIXED: use "token" instead of "authToken"
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('token'))
  );

  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('token')));
    };

    window.addEventListener('authStateChanged', handler);
    return () => window.removeEventListener('authStateChanged', handler);
  }, []);

  return (
    <CartProvider>
      <ScrollToTop />

      {/* Pass auth state */}
      <Navbar isAuthenticated={isAuthenticated} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/items" element={<Items />} />

        {/* ✅ FIXED Cart route */}
        <Route
          path="/cart"
          element={
            isAuthenticated ? <Cart /> : <Navigate to="/login" replace />
          }
        />

        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Orders */}
        <Route path="/myorders/verify" element={<VerifyPaymentPage />} />
        <Route path="/myorders" element={<MyOrders />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

export default App;