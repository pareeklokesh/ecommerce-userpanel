import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user) return;
    setCartLoading(true);
    try {
      const r = await API.get('/cart');
      setCart(r.data.data?.items || []);
    } catch { setCart([]); }
    setCartLoading(false);
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    await API.post('/cart/add', { productId, quantity });
    fetchCart();
  };

  const removeFromCart = async (productId) => {
    await API.post('/cart/remove', { productId });
    fetchCart();
  };

  return <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
