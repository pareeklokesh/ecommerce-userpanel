import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import API from '../../api/axios';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './ProductDetail.module.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/products/${id}`).then(r => setProduct(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); return; }
    try { await addToCart(product._id); toast.success('Added to cart!'); }
    catch { toast.error('Failed'); }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (!product) return <p className={styles.loading}>Product not found</p>;

  const discount = product.discountPrice > 0 ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  return (
    <div>
      <button className={styles.back} onClick={() => navigate(-1)}><ArrowLeft size={16} /> Back</button>
      <div className={styles.layout}>
        <div className={styles.gallery}>
          <img src={product.images[activeImg]} alt={product.title} className={styles.mainImg} />
          {product.images.length > 1 && (
            <div className={styles.thumbs}>
              {product.images.map((img, i) => (
                <img key={i} src={img} alt="" className={`${styles.thumb} ${i === activeImg ? styles.activeThumb : ''}`} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.title}>{product.title}</h1>
          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.discountPrice > 0 ? product.discountPrice : product.price}</span>
            {product.discountPrice > 0 && <>
              <span className={styles.originalPrice}>₹{product.price}</span>
              <span className={styles.discountBadge}>{discount}% off</span>
            </>}
          </div>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.stockInfo}>
            <span className={product.stock > 0 ? styles.inStock : styles.outStock}>
              {product.stock > 0 ? `✓ ${product.stock} in stock` : '✗ Out of stock'}
            </span>
          </div>
          <button className={styles.addBtn} onClick={handleAddToCart} disabled={product.stock === 0}>
            <ShoppingCart size={18} /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}
