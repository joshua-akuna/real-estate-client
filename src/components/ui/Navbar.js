'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
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
  const menuRef = useRef(null);

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const closeMenu = () => {
      setIsMenuOpen(false);
    };
    closeMenu();
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClickOutside(e) {
      if (!menuRef.current?.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener('mouseup', handleClickOutside);
    return () => document.removeEventListener('mouseup', handleClickOutside);
  }, [isMenuOpen]);

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
          <span className={styles.logoIcon}>
            <Image
              src='/images/icon.png'
              alt='page icon'
              width={30}
              height={30}
            />
          </span>
          Naijacribs
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
