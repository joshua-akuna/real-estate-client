'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from '../ui/Loading';
import styles from './PropertyEditForm.module.css';
import { propertyAPI } from '@/services/apiService';
import { useParams, useRouter } from 'next/navigation';

export default function PropertyEditForm({ propertyId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'house',
    listing_type: 'sale',
    price: '',
    rental_period: '',
    bedrooms: '',
    bathrooms: '',
    area_sqft: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: '',
    latitude: '',
    longitude: '',
    status: 'active',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [imageUpdateMode, setImageUpdateMode] = useState(false);

  useEffect(() => {
    loadProperty();
  }, [propertyId]);

  const loadProperty = async () => {
    setInitialLoading(true);
    try {
      const response = await propertyAPI.getPropertyForEdit(propertyId);
      const property = response.data?.property;
      // console.log('Property ID:', propertyId);
      // console.log('Property:', property);

      setFormData({
        title: property.title || '',
        description: property.description || '',
        property_type: property.property_type || 'house',
        listing_type: property.listing_type || 'sale',
        price: property.price || '',
        rental_period: property.rental_period || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area_sqft: property.area_sqft || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zip_code: property.zip_code || '',
        country: property.country || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        status: property.status || 'active',
      });
      setExistingImages(property.images || []);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load property');
      if (error.response?.status === 403) {
        setTimeout(() => router.push('/properties/my-properties'), 2000);
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear rental_period if listing_type is sale
    if (name === 'listing_type' && value === 'sale') {
      setFormData((prev) => ({ ...prev, rental_period: '' }));
    }
  };

  const handleSubmitDetails = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    console.log(formData);

    try {
    } catch (error) {
    } finally {
    }
  };

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.editForm}>
      {error && <div className=''>{error}</div>}
      {successMessage && <div className=''>{successMessage}</div>}

      {/* Property Details Section */}
      <div className={styles.section}>
        <h2>Property Details</h2>
        <form onSubmit={handleSubmitDetails}>
          <div className='form-group'>
            <label htmlFor='title' className=''>
              Title
            </label>
            <input
              type='text'
              name='title'
              id='title'
              className=''
              onChange={handleChange}
              value={formData.title}
            />
          </div>
          <div className=''>
            <label htmlFor='description' className=''>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              className=''
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className=''>
            <div className=''>
              <label htmlFor='property_type' className=''>
                Property Type
              </label>
              <select
                name='property_type'
                id='property_type'
                className=''
                value={formData.property_type}
                onChange={handleChange}
              >
                <option value='house'>House</option>
                <option value='apartment'>Apartment</option>
                <option value='condo'>Condo</option>
                <option value='townhouse'>Townhouse</option>
                <option value='land'>Land</option>
              </select>
            </div>

            <div className=''>
              <label htmlFor='listing_type' className=''>
                Listing Types
              </label>
              <select
                name='listing_type'
                id='listing_type'
                className=''
                value={formData.listing_type}
                onChange={handleChange}
              >
                <option value='sale'>For Sale</option>
                <option value='rent'>For Rent</option>
              </select>
            </div>
          </div>

          <div className=''>
            <div className=''>
              <label htmlFor='price' className=''>
                Price
              </label>
              <input
                type='number'
                className=''
                name='price'
                id='price'
                min='0'
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            {formData.listing_type === 'rent' && (
              <div className=''>
                <label htmlFor='rental_period' className=''>
                  Rental Period
                </label>
                <select
                  name='rental_period'
                  id='rental_period'
                  className=''
                  value={formData.rental_period}
                  onChange={handleChange}
                >
                  <option value='' disabled hidden>
                    Select an option
                  </option>
                  <option value='day'>Per Day</option>
                  <option value='week'>Per Week</option>
                  <option value='month'>Per Month</option>
                  <option value='year'>Per Year</option>
                </select>
              </div>
            )}

            <div className=''>
              <label htmlFor='status' className=''>
                Status
              </label>
              <select
                name='status'
                id='status'
                className=''
                value={formData.status}
                onChange={handleChange}
              >
                <option value='active'>Active</option>
                <option value='pending'>Pending</option>
                <option value='sold'>Sold</option>
                <option value='rented'>Rented</option>
              </select>
            </div>
          </div>

          <div className=''>
            <div className=''>
              <label htmlFor='bedrooms' className=''>
                Bedrooms
              </label>
              <input
                type='number'
                className=''
                name='bedrooms'
                id='bedrooms'
                value={formData.bedrooms}
                onChange={handleChange}
                min='0'
              />
            </div>

            <div className=''>
              <label htmlFor='bathrooms' className=''>
                Bathrooms
              </label>
              <input
                type='number'
                className=''
                name='bathrooms'
                id='bathrooms'
                value={formData.bathrooms}
                onChange={handleChange}
                min='0'
              />
            </div>

            <div className=''>
              <label htmlFor='area_sqft' className=''>
                Area (sqft)
              </label>
              <input
                type='number'
                className=''
                name='area_sqft'
                id='area_sqft'
                min='0'
                value={formData.area_sqft}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className=''>
            <label htmlFor='address' className=''>
              Address
            </label>
            <input
              type='text'
              className=''
              name='address'
              id='address'
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className=''>
            <div className=''>
              <label htmlFor='country' className=''>
                Country *
              </label>
              <input
                type='text'
                className=''
                name='country'
                id='country'
                value={formData.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <button className='btn btn-primary' type='submit' disabled={loading}>
            {loading ? 'Updating...' : 'Update Property'}
          </button>
        </form>
      </div>

      {/* Images Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Property Images</h2>
          <button
            type='button'
            onClick={() => setImageUpdateMode(!imageUpdateMode)}
            className='btn btn-primary'
          >
            {imageUpdateMode ? 'Cancel' : 'Manage Images'}
          </button>
        </div>

        {/* Current images */}
        <div className={styles.currentImages}>
          <h3>Current Images ({existingImages.length})</h3>
          <div className={styles.imageGrid}>
            {existingImages.map((image) => {
              const isMarkedForDeletion = imagesToDelete.includes(image.id);
              return (
                <div
                  className={`${styles.imageItem} ${isMarkedForDeletion ? styles.markedForDeletion : ''}`}
                  key={image.id}
                >
                  <div className={styles.imageWrapper}>
                    <Image
                      src={image.image_url}
                      alt={`Property image ${image.image_order}`}
                      fill
                      sizes='200px'
                      className={styles.image}
                    />
                    {isMarkedForDeletion && (
                      <div className={styles.deletionOverlay}>
                        <span>Will be deleted</span>
                      </div>
                    )}
                  </div>
                  {imageUpdateMode && (
                    <div className={styles.imageActions}>
                      {isMarkedForDeletion ? (
                        <button
                          className={styles.undoBtn}
                          type='button'
                          onClick={``}
                        >
                          Undo
                        </button>
                      ) : (
                        <button
                          className={styles.deleteBtn}
                          type='button'
                          onClick={``}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                  <span className={styles.imageOrder}>
                    #{image.image_order}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {imageUpdateMode && (
          <>
            {/* Add New Images */}
            <div className=''>
              <div>
                <h3>Add New Images</h3>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  className='form-input'
                  onChange={``}
                />
                {newImages.length > 0 && (
                  <p className=''>{newImages.length} new image(s) selected</p>
                )}
              </div>

              {newImages.length > 0 && (
                <div className=''>
                  {Array.from(newImages).map((file, index) => {
                    <div className='' key={index}>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New image ${index + 1}`}
                        className=''
                      />
                      <span>New #{index + 1}</span>
                    </div>;
                  })}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className=''>
              <button
                type='button'
                className='btn btn-primary'
                disabled={
                  loading ||
                  (imagesToDelete.length === 0 && newImages.length === 0)
                }
              >
                {loading ? 'Updating...' : 'Apply Changes'}
              </button>

              <button
                type='button'
                className='btn btn-secondary'
                disabled={loading || newImages.length === 0}
                onClick={``}
              >
                Replace All Images
              </button>
            </div>

            <p className=''>
              <strong>Tip:</strong> You can delete existing images and add new
              ones, or use &apos;Replace All Images&apos; to remove all current
              images and upload new ones. Maximum 10 images allowed.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
