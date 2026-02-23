'use client';

import { useEffect } from 'react';
import styles from './error.module.css';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <h1>Something went wrong!</h1>
        <p>{error.message || 'An unexpected error occurred'}</p>
        <button onClick={reset} className='btn btn-primary'>
          Try again
        </button>
      </div>
    </div>
  );
}
