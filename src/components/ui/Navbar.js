'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';
import { authAPI } from '@/services/apiService';
import { useAuth } from '@/app/context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useAuth();
  const router = useRouter();

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await authAPI.profile();
        setUser(response.data?.user);
      } catch (error) {
        setUser(null);
      }
    };
    getUser();
  }, []);

  async function handleLogout(e) {
    e.preventDefault();
    await authAPI.logout();
    setUser(null);
    router.push('/');
    router.refresh();
  }

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
          {isMenuOpen ? <X /> : <Menu />}
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
          {user ? (
            <button
              onClick={handleLogout}
              className={`${styles.logout} btn btn-outline`}
            >
              Logout
            </button>
          ) : (
            <li>
              <Link href='/auth/login' className='btn btn-outline'>
                Login
              </Link>
            </li>
          )}
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
