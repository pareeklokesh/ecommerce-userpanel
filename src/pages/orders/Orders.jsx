import { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import API from '../../api/axios';
import styles from './Orders.module.css';

const STATUS_COLORS = { pending: '#f59e0b', confirmed: '#3b82f6', shipped: '#8b5cf6', delivered: '#10b981', cancelled: '#ef4444' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders').then(r => setOrders(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className={styles.loading}>Loading orders...</p>;

  if (orders.length === 0) return (
    <div className={styles.empty}>
      <Package size={48} className={styles.emptyIcon} />
      <h3>No orders yet</h3>
      <p>Your order history will appear here</p>
    </div>
  );

  return (
    <div>
      <h2 className={styles.title}>My Orders</h2>
      <div className={styles.list}>
        {orders.map(o => (
          <div key={o._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <span className={styles.orderId}>Order #{o._id.slice(-6).toUpperCase()}</span>
                <span className={styles.date}>{new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <span className={styles.badge} style={{ background: STATUS_COLORS[o.status] + '20', color: STATUS_COLORS[o.status] }}>
                {o.status}
              </span>
            </div>
            <div className={styles.orderBody}>
              <div className={styles.orderItems}>
                {o.items?.map((item, i) => (
                  <div key={i} className={styles.orderItem}>
                    <span>{item.productId?.title || 'Product'}</span>
                    <span className={styles.qty}>× {item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className={styles.orderFooter}>
                <p className={styles.address}><strong>Address:</strong> {o.address}</p>
                <p className={styles.total}>Total: <strong>₹{o.totalAmount?.toLocaleString()}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
