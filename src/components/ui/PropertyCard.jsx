'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/helpers';
import styles from './PropertyCard.module.css';
import { MapPin, Bed, Bath } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PropertyCard({ property }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toggleFavorite, checkFavorite } = useFavorites();
  const { user } = useAuth();
  const router = useRouter();

  const mainImage =
    property.images?.[0]?.image_url || '/images/placeholder.avif';

  useEffect(() => {
    const checkFav = async () => {
      setIsFavorited(await checkFavorite(property.id));
    };
    checkFav();
  }, []);

  async function handleFavoriteClick(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      const favorited = await toggleFavorite(property.id);
      setIsFavorited(favorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <Link href={`/properties/${property.id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <Image
            loading='eager'
            src={mainImage}
            alt={property.title}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className={styles.image}
          />
          <button
            className={`${styles.favoriteBtn} ${isFavorited ? styles.favorited : ''}`}
            disabled={isLoading}
            onClick={handleFavoriteClick}
          >
            {isFavorited ? '❤️' : '🤍'}
          </button>
          <div className={styles.badge}>
            {property.listing_type === 'sale' ? 'For Sale' : 'For Rent'}
          </div>
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/properties/${property.id}`}>
          <h3 className={styles.title}>{property.title}</h3>
        </Link>
        <p className={styles.location}>
          <MapPin color='blue' size={18} /> {property.city}, {property.state}
        </p>
        <p className={styles.price}>
          {formatPrice(property.price, property.rental_period)}
        </p>
        <div className={styles.features}>
          {property.bedrooms > 0 && (
            <span>
              <Bed color='blue' size={18} /> {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms > 0 && (
            <span>
              <Bath color='blue' size={18} /> {parseInt(property.bathrooms)}{' '}
              baths
            </span>
          )}
          {property.area_sqft > 0 && (
            <span>📐 {property.area_sqft.toLocaleString()} sqft</span>
          )}
        </div>
      </div>
    </div>
  );
}
