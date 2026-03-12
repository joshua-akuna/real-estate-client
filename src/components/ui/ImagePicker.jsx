'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ImagePicker.module.css';

export default function ImagePicker({ onImagesChange, maxFiles = 10 }) {
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    onImagesChange?.(images);
  }, [onImagesChange, images]);

  const addFiles = (files) => {
    const valid = Array.from(files).filter((f) => f.type.startsWith('image/'));
    setImages((prev) => {
      const slots = maxFiles - prev.length;
      const toAdd = valid.slice(0, slots).map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        file,
      }));
      const next = [...prev, ...toAdd];
      //   onImagesChange?.(next);
      return next;
    });
  };

  const remove = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      //   onImagesChange?.(next);
      return next;
    });
  };

  return (
    <div className={styles.ip_wrapper}>
      <div className={styles.ip_grid}>
        {/* Upload cell — always first */}
        {images.length < maxFiles && (
          <div
            className={`${styles.ip_cell} ${styles.ip_upload}`}
            onClick={() => inputRef.current.click()}
          >
            <svg
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='1.5'
            >
              <line x1='12' y1='5' x2='12' y2='19' />
              <line x1='5' y1='12' x2='19' y2='12' />
            </svg>
            <input
              ref={inputRef}
              type='file'
              accept='image/*'
              multiple
              hidden
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>
        )}

        {/* Image thumbnails */}
        {images.map((img) => (
          <div key={img.id} className={`${styles.ip_cell} ${styles.ip_thumb}`}>
            <img src={img.url} alt={img.url} />
            <button className={styles.ip_remove} onClick={() => remove(img.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
