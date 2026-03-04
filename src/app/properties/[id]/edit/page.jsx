import styles from './edit.module.css';

export const metadata = {
  title: 'Edit Property - Real Estate App',
};

export default function EditPropertyPage({ params }) {
  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>Edit Property</h1>
          <p>Update your property details and images</p>
        </div>
      </div>
    </div>
  );
}
