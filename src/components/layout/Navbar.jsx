import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>E</span>
          <span className={styles.logoText}>EcomStore</span>
        </Link>
        <div className={styles.links}>
          <Link to="/" className={styles.link}>Home</Link>
          <Link to="/products" className={styles.link}>Products</Link>
        </div>
        <div className={styles.actions}>
          {user ? (
            <>
              <Link to="/cart" className={styles.iconBtn}>
                <ShoppingCart size={20} />
                {cart.length > 0 && <span className={styles.badge}>{cart.length}</span>}
              </Link>
              <Link to="/orders" className={styles.iconBtn}><Package size={20} /></Link>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout}><LogOut size={16} /></button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Login</Link>
              <Link to="/register" className={styles.registerBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
