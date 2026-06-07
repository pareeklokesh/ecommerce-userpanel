import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form.email, form.password);
      if (res.success) { toast.success('Welcome back!'); navigate('/'); }
      else toast.error(res.message || 'Login failed');
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>E</div>
        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.sub}>Sign in to your account</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}><label>Email</label><input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required /></div>
          <div className={styles.field}><label>Password</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required /></div>
          <button type="submit" className={styles.btn} disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p className={styles.switchText}>Don't have an account? <Link to="/register" className={styles.switchLink}>Register</Link></p>
      </div>
    </div>
  );
}
