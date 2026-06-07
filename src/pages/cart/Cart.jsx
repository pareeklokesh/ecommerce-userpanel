import { useState } from 'react';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import styles from './Cart.module.css';

export default function Cart() {
  const { cart, removeFromCart, cartLoading } = useCart();
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => {
    const price = item.productId?.discountPrice > 0 ? item.productId?.discountPrice : item.productId?.price;
    return sum + (price * item.quantity);
  }, 0);

  const handleOrder = async () => {
    if (!address.trim()) { toast.error('Please enter delivery address'); return; }
    setOrdering(true);
    try {
      await API.post('/orders/create', {
        items: cart.map(i => ({ productId: i.productId._id, quantity: i.quantity })),
        totalAmount: total,
        address
      });
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to place order'); }
    setOrdering(false);
  };

  if (cartLoading) return <p className={styles.loading}>Loading cart...</p>;

  if (cart.length === 0) return (
    <div className={styles.empty}>
      <ShoppingBag size={48} className={styles.emptyIcon} />
      <h3>Your cart is empty</h3>
      <p>Add some products to get started</p>
      <Link to="/products" className={styles.shopBtn}>Shop Now</Link>
    </div>
  );

  return (
    <div className={styles.layout}>
      <div className={styles.items}>
        <h2 className={styles.title}>Shopping Cart ({cart.length})</h2>
        {cart.map(item => {
          const p = item.productId;
          const price = p?.discountPrice > 0 ? p?.discountPrice : p?.price;
          return (
            <div key={item._id} className={styles.item}>
              <img src={p?.images?.[0]} alt={p?.title} className={styles.itemImg} />
              <div className={styles.itemInfo}>
                <p className={styles.itemName}>{p?.title}</p>
                <p className={styles.itemCat}>{p?.category}</p>
                <div className={styles.itemBottom}>
                  <span className={styles.itemPrice}>₹{price} × {item.quantity}</span>
                  <span className={styles.itemTotal}>₹{(price * item.quantity).toLocaleString()}</span>
                </div>
              </div>
              <button className={styles.removeBtn} onClick={() => removeFromCart(p._id)}>
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.summary}>
        <h3 className={styles.summaryTitle}>Order Summary</h3>
        <div className={styles.summaryRow}><span>Items ({cart.length})</span><span>₹{total.toLocaleString()}</span></div>
        <div className={styles.summaryRow}><span>Shipping</span><span className={styles.free}>Free</span></div>
        <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        <div className={styles.addressField}>
          <label>Delivery Address *</label>
          <textarea placeholder="Enter your full delivery address..." value={address} onChange={e => setAddress(e.target.value)} rows={3} />
        </div>
        <button className={styles.orderBtn} onClick={handleOrder} disabled={ordering}>
          {ordering ? 'Placing Order...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}
