import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className='container'>
          <h1 className={styles.heroTitle}>Find Your Dream Property</h1>
          <p className={styles.heroSubtitle}>
            Discover the perfect home or investment opportunity
          </p>
          <div className={styles.heroButtons}>
            <Link href='/properties' className='btn btn-primary'>
              Browse Properties
            </Link>
            <Link href='/properties/new' className='btn btn-outline white'>
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className='container'>
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <div className='grid grid-3'>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🏠</div>
              <h3>Wide Selection</h3>
              <p>Browse thousands of properties across various locations</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Best Prices</h3>
              <p>Competitive pricing and transparent transactions</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>✨</div>
              <h3>Easy Process</h3>
              <p>Simple and streamlined property listing and buying</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
