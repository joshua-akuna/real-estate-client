'use client';

import Link from 'next/link';
import { ArrowLeft, BathIcon, BedIcon, LandPlot, MapPin } from 'lucide-react';
import styles from './property-detail.module.css';
import { useState } from 'react';
import Image from 'next/image';
import { formatDate, formatPrice, getPropertyTypeLabel } from '@/utils/helpers';
import ImageGallery from '@/components/ui/ImageGallery';

export default function PropertyDetail({ property }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [showMessageForm, setshowMessageForm] = useState(false);

  const toggleFavorite = () => {
    setIsFavorited((prev) => !prev);
  };

  return (
    <div className={styles.page}>
      <div className='container'>
        <Link href={`/properties`} className={styles.backLink}>
          ← Back to Properties
        </Link>

        <div className={styles.content}>
          <div className=''>
            <ImageGallery images={property.images} />
          </div>

          <div className={styles.info}>
            <div className={styles.header}>
              <div>
                <span className={styles.badge}>
                  {property.listing_type === 'sale' ? 'For Sale' : 'For rent'}
                </span>
                <h1>{property.title}</h1>
                <p className={styles.location}>
                  <MapPin color='blue' /> {property.address}, {property.city},{' '}
                  {property.state} {property.zip_code}
                </p>
              </div>
              <button onClick={toggleFavorite} className={styles.favoriteBtn}>
                {isFavorited ? '❤️' : '🤍'}
              </button>
            </div>

            <div className={styles.price}>
              {formatPrice(property.price, property.rental_period)}
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🏠</span>
                <div className=''>
                  <strong>
                    {getPropertyTypeLabel(property.property_type)}
                  </strong>
                  <p>Property Type</p>
                </div>
              </div>
              {property.bedrooms > 0 && (
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <BedIcon color='blue' size={45} />
                  </span>
                  <div>
                    <strong>{property.bedrooms}</strong>
                    <p>Bedrooms</p>
                  </div>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <BathIcon color='blue' size={45} />
                  </span>
                  <div>
                    <strong>{Number(property.bathrooms)}</strong>
                    <p>Bathrooms</p>
                  </div>
                </div>
              )}
              {property.area_sqft > 0 && (
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>
                    <LandPlot color='blue' size={45} />
                  </span>
                  <div>
                    <strong>{property.area_sqft.toLocaleString()}</strong>
                    <p>Square Feet</p>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.section}>
              <h2>Description</h2>
              <p>{property.description}</p>
            </div>

            <div className={styles.section}>
              <h2>Property Details</h2>
              <div className={styles.detailGrid}>
                <div className={styles.detail}>
                  <span>Status:</span>
                  <strong>{property.status}</strong>
                </div>
                <div className={styles.detail}>
                  <span>Listed on:</span>
                  <strong>{formatDate(property.created_at)}</strong>
                </div>
                {property.country && (
                  <div className={styles.detail}>
                    <span>Country:</span>
                    <strong>{property.country}</strong>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.section}>
              <h2>Listed By</h2>
              <div className={styles.owner}>
                {property.owner_avatar && (
                  <Image
                    src={property.owner_avatar}
                    alt={property.owner_name}
                    width={60}
                    height={60}
                    className={styles.ownerAvatar}
                  />
                )}
                <div>
                  <strong>{property.owner_name}</strong>
                  <p>{property.owner_email}</p>
                  {property.owner_phone && <p>{property.owner_phone}</p>}
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                onClick={() => setshowMessageForm(!showMessageForm)}
                className='btn btn-primary'
              >
                {showMessageForm ? 'Hide Message Form' : 'Contact Owner'}
              </button>
            </div>

            {showMessageForm && (
              <div className={styles.messageForm}>
                <h2>Message Form Placeholder</h2>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
