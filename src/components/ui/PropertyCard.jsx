import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/utils/helpers';
import styles from './PropertyCard.module.css';
import { MapPin, Bed, Bath } from 'lucide-react';

export default function PropertyCard({ property, onFavoriteToggle }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const mainImage = property.images?.[0]?.image_url;
  //   console.log(mainImage);

  async function handleFavoriteClick(e) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const favorited = await onFavoriteToggle(property.id);
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
          {property.bedrooms && (
            <span>
              <Bed color='blue' size={18} /> {property.bedrooms} beds
            </span>
          )}
          {property.bathrooms && (
            <span>
              <Bath color='blue' size={18} /> {parseInt(property.bathrooms)}{' '}
              baths
            </span>
          )}
          {property.area_sqft && (
            <span>📐 {property.area_sqft.toLocaleString()} sqft</span>
          )}
        </div>
      </div>
    </div>
  );
}
