'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Eye, EyeOff } from 'lucide-react';
import styles from './LoginForm.module.css';
import { authAPI } from '@/services/apiService';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  }

  function handleGoogleLogin() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('email', formData.email);
      data.append('full_name', formData.full_name);
      data.append('password', formData.password);
      if (formData.phone) data.append('phone', formData.phone);
      if (avatar) data.append('avatar', avatar);

      const response = await authAPI.register(data);
      // console.log('Response:', response.data);
      router.push('/properties');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Register</h2>
        {error && <div className='error-message'>{error}</div>}
        <div className='form-group'>
          <label className='form-label' htmlFor='full_name'>
            Full Name *
          </label>
          <input
            type='text'
            name='full_name'
            value={formData.full_name}
            onChange={handleChange}
            className='form-input'
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email' className='form-label'>
            Email *
          </label>
          <input
            className='form-input'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password' className='form-label'>
            Password *
          </label>
          <div className='form-eye-input'>
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              className='form-input'
              required
            />
            <button
              className='form-eye'
              type='button'
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='phone' className='form-label'>
            Phone
          </label>
          <input
            type='tel'
            name='phone'
            value={formData.phone}
            onChange={handleChange}
            className='form-input'
          />
        </div>
        <button className='btn btn-primary' type='submit' disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <div className={styles.divider}>
          <span>OR</span>
        </div>
        <button
          className={styles.googleBtn}
          type='button'
          onClick={handleGoogleLogin}
        >
          <Mail size={24} color='#EA4335' />
          Continue with Google
        </button>
        <p className={styles.switchForm}>
          Already have an account? <Link href='/auth/login'>Login</Link>
        </p>
      </form>
    </div>
  );
}
