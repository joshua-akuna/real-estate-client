'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { authAPI } from '@/services/apiService';
import styles from './LoginForm.module.css';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authAPI.login(formData);
      // console.log(response.data?.user);
      setUser(response.data?.user);
      router.push('/properties');
    } catch (error) {
      //   console.error(error.response?.data?.message);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleGoogleLogin() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google`;
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Login</h2>

        {error && <div className='error-message'>{error}</div>}

        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email
          </label>
          <input
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>

        <div className={styles.forgotPassword}>
          <Link href='/auth/forgot-password'>Forgot password?</Link>
        </div>

        <button type='submit' disabled={loading} className='btn btn-primary'>
          {loading ? 'Loggin in...' : 'Login'}
        </button>

        <div className={styles.divider}>
          <span>OR</span>
        </div>

        <button
          type='button'
          className={styles.googleBtn}
          onClick={handleGoogleLogin}
        >
          <Mail size={24} color='#EA4335' />
          Continue with Google
        </button>

        <p className={styles.switchForm}>
          Don&apos;t have an account?{' '}
          <Link href='/auth/register'>Register here</Link>
        </p>
      </form>
    </div>
  );
}
