import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await register(form.name, form.email, form.password);
      if (res.success) { toast.success('Account created! Please login'); navigate('/login'); }
      else toast.error(res.message || 'Registration failed');
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>E</div>
        <h1 className={styles.title}>Create account</h1>
        <p className={styles.sub}>Join us today</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Full Name</label><input placeholder="John Doe" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
          <div className={styles.field}><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className={styles.field}><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
        </form>
        <p className={styles.switchText}>Already have an account? <Link to="/login" className={styles.switchLink}>Login</Link></p>
      </div>
    </div>
  );
}
