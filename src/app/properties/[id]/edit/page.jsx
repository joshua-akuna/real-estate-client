import PropertyEditForm from '@/components/forms/PropertyEditForm';
import styles from './edit.module.css';

export const metadata = {
  title: 'Edit Property - Real Estate App',
};

export default async function EditPropertyPage({ params }) {
  const { id } = await params;

  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>Edit Property</h1>
          <p>Update your property details and images</p>
        </div>
        <PropertyEditForm propertyId={id} />
      </div>
    </div>
  );
}
