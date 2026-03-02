'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './favorites.module.css';
import Loading from '@/components/ui/Loading';
import { useFavorites } from '@/hooks/useFavorites';
import PropertyCard from '@/components/ui/PropertyCard';

export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, loading, loadFavorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  if (loading) return <Loading />;

  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>My Favorites</h1>
          <p>Favorites you&apos;ve saved for later</p>
        </div>

        {favorites.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>❤️</div>
            <h2>No favorites yet</h2>
            <p>Start adding propertied to your favorites to see them here</p>
            <Link className='btn btn-primary' href='/properties'>
              Browse Properties
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.count}>
              <p>You have {favorites.length} favorite properties</p>
            </div>
            <div className='grid grid-3'>
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
