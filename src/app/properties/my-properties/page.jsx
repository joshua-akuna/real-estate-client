'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { propertyAPI } from '@/services/apiService';
import styles from './my-properties.module.css';
import PropertyCard from '@/components/ui/PropertyCard';
import Loading from '@/components/ui/Loading';

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyAPI.getUserProperties();
      setProperties(response.data?.properties);
      // console.log(response.data?.properties[0]);
    } catch (error) {
      console.error('Error loading properties:', error);
      if (error.response?.status === 401) {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const handleDelete = async (propertyId) => {
    if (!confirm('Confirm to delete')) return;

    try {
      await propertyAPI.deleteProperty(propertyId);
      const response = await propertyAPI.getUserProperties();
      setProperties(response.data?.properties);
    } catch (error) {
      alert('Failed to delete property');
    }
  };

  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>My Properties</h1>
          <Link className='btn btn-primary' href='/properties/new'>
            + Add New Property
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className={styles.empty}>
            <h2>You haven&apos;t listed any properties yet</h2>
            <p>Start by adding your first property</p>
            <Link className='btn btn-primary' href={`/properties/new`}>
              List a Property
            </Link>
          </div>
        ) : (
          <div className='grid grid-3'>
            {properties.map((property) => (
              <div key={property.id} className={styles.propertyWrapper}>
                <div className={styles.cardWrapper}>
                  <PropertyCard property={property} />
                </div>
                <div className={styles.actions}>
                  <Link
                    className='btn btn-outline'
                    href={`/properties/${property.id}/edit`}
                  >
                    Edit
                  </Link>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(property.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
