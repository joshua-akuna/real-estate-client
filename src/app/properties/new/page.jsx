import PropertyForm from '@/components/forms/PropertyForm';
import styles from './new-property.module.css';

export const metadata = {
  title: 'List New Property | Real Estate App',
};

export default function NewPropertyPage() {
  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>List Your Property</h1>
          <p>Fill in the details to list your property for sale or rent</p>
        </div>
        <PropertyForm />
      </div>
    </div>
  );
}
