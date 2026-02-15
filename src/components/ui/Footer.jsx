import styles from './Footer.module.css';

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
                <a href='/properties'>Properties</a>
              </li>
              <li>
                <a href='/favorites'>Favorites</a>
              </li>
              <li>
                <a href='/messages'>Messages</a>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Contact</h4>
            <p>Email: info@realestate.com</p>
            <p>Phone: (555) 123-4567</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2024 RealEstate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
