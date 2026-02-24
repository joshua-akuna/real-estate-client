import Image from 'next/image';
import styles from './ImageGallery.module.css';
import { useState } from 'react';

export default function ImageGallery({ images }) {
  const [selectedImage, setselectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className={styles.placeholder}>
        <p>No images available</p>
      </div>
    );
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        <Image
          src={images[selectedImage].image_url}
          alt={`Property image ${selectedImage + 1}`}
          fill
          sizes='(max-width: 768px) 100vw, 70vw'
          className={styles.image}
          priority
        />
      </div>

      <div className={styles.thumbnails}>
        {images.map((image, index) => (
          <button
            key={image.id}
            className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ''}`}
            onClick={() => setselectedImage(index)}
          >
            <Image
              src={image.image_url}
              alt={`Thumbnail ${index + 1}`}
              fill
              sizes='100px'
              className={styles.thumbnailImage}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
