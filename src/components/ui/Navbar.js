'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href='/' className={styles.logo}>
          <span className={styles.logoIcon}>🏡</span>
          RealEstate
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul
          className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}
        >
          <li>
            <Link
              href='/properties'
              className={isActive('/properties') ? styles.active : ''}
            >
              Properties
            </Link>
          </li>
          <li>
            <Link
              href='/favorites'
              className={isActive('/favorites') ? styles.active : ''}
            >
              Favorites
            </Link>
          </li>
          <li>
            <Link
              href='/messages'
              className={isActive('/messages') ? styles.active : ''}
            >
              Messages
            </Link>
          </li>
          <li>
            <Link
              href='/properties/my-properties'
              className={
                isActive('/properties/my-properties') ? styles.active : ''
              }
            >
              My Properties
            </Link>
          </li>
          <li>
            <Link href='/auth/login' className='btn btn-outline'>
              Login
            </Link>
          </li>
          <li>
            <Link href='/properties/new' className='btn btn-primary'>
              List Property
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
