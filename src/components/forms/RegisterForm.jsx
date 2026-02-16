'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import styles from './LoginForm.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleAvatarChange(e) {}

  function handleGoogleLogin() {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/google`;
  }

  function handleSubmit() {}

  console.log(formData);

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
          <input
            type='password'
            name='password'
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            className='form-input'
            required
          />
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
        <div className='form-group'>
          <label htmlFor='avater' className='form-label'>
            Profile Picture
          </label>
          <input
            type='file'
            name='avatar'
            accept='image/*'
            onChange={handleAvatarChange}
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
