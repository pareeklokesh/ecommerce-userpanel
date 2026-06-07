import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Home.module.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    API.get('/products').then(r => setProducts(r.data.data?.slice(0, 8) || [])).finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) { toast.error('Please login to add to cart'); return; }
    try { await addToCart(productId); toast.success('Added to cart!'); }
    catch { toast.error('Failed to add'); }
  };

  return (
    <div>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Shop the Latest<br /><span>Collection</span></h1>
          <p className={styles.heroSub}>Discover amazing products at unbeatable prices. Quality you can trust.</p>
          <Link to="/products" className={styles.heroBtn}>Browse All Products <ArrowRight size={16} /></Link>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured Products</h2>
          <Link to="/products" className={styles.seeAll}>See all <ArrowRight size={14} /></Link>
        </div>
        {loading ? <p className={styles.loading}>Loading products...</p> : (
          <div className={styles.grid}>
            {products.map(p => (
              <div key={p._id} className={styles.card}>
                <Link to={`/products/${p._id}`}>
                  <div className={styles.imgWrap}>
                    <img src={p.images[0]} alt={p.title} className={styles.img} />
                    {p.discountPrice > 0 && <span className={styles.discountBadge}>Sale</span>}
                  </div>
                </Link>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{p.category}</span>
                  <Link to={`/products/${p._id}`}><h3 className={styles.productTitle}>{p.title}</h3></Link>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>₹{p.discountPrice > 0 ? p.discountPrice : p.price}</span>
                    {p.discountPrice > 0 && <span className={styles.originalPrice}>₹{p.price}</span>}
                  </div>
                  <button className={styles.addBtn} onClick={() => handleAddToCart(p._id)}>
                    <ShoppingCart size={15} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
