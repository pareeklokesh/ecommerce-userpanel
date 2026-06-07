import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Products.module.css';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    API.get('/products').then(r => setProducts(r.data.data || [])).finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category ? p.category === category : true;
    return matchSearch && matchCat;
  });

  const handleAddToCart = async (productId) => {
    if (!user) { toast.error('Please login'); return; }
    try { await addToCart(productId); toast.success('Added to cart!'); }
    catch { toast.error('Failed'); }
  };

  return (
    <div>
      <h2 className={styles.pageTitle}>All Products</h2>
      <div className={styles.filters}>
        <div className={styles.searchBar}>
          <Search size={15} />
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className={styles.catSelect} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      {loading ? <p className={styles.loading}>Loading...</p> : (
        <div className={styles.grid}>
          {filtered.map(p => (
            <div key={p._id} className={styles.card}>
              <Link to={`/products/${p._id}`}>
                <div className={styles.imgWrap}>
                  <img src={p.images[0]} alt={p.title} className={styles.img} />
                </div>
              </Link>
              <div className={styles.cardBody}>
                <span className={styles.category}>{p.category}</span>
                <Link to={`/products/${p._id}`}><h3 className={styles.productTitle}>{p.title}</h3></Link>
                <div className={styles.priceRow}>
                  <span className={styles.price}>₹{p.discountPrice > 0 ? p.discountPrice : p.price}</span>
                  {p.discountPrice > 0 && <span className={styles.originalPrice}>₹{p.price}</span>}
                </div>
                <p className={styles.stock}>{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
                <button className={styles.addBtn} onClick={() => handleAddToCart(p._id)} disabled={p.stock === 0}>
                  <ShoppingCart size={14} /> {p.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className={styles.empty}>No products found</p>}
        </div>
      )}
    </div>
  );
}
