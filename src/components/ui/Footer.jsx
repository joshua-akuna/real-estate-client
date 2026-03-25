import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className='container'>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>RealEstate</h3>
            <p>Your trusted property marketplace</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link href='/properties'>Properties</Link>
              </li>
              <li>
                <Link href='/favorites'>Favorites</Link>
              </li>
              <li>
                <Link href='/messages'>Messages</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>
              Email:{' '}
              <a href='mailto:akunajoshua@gmail.com'>akunajoshua@gmail.com</a>
            </p>
            <p>
              Phone: <a href='tel:+2348151153399'>+234 815 115 3399</a>
            </p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 Naijacribs. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
