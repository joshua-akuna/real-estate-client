'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loading from '../ui/Loading';
import styles from './PropertyEditForm.module.css';
import { propertyAPI } from '@/services/apiService';
import { useParams, useRouter } from 'next/navigation';
import ImagePicker from '../ui/ImagePicker';

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
  const [previews, setPreviews] = useState([]);
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

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    // console.log(formData);

    try {
      // Update property details
      await propertyAPI.updateProperty(propertyId, formData);
      setSuccessMessage('Property details updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update property');
    } finally {
      setLoading(false);
    }
  };

  const handleUndoDeleteImage = (imageId) => {
    setImagesToDelete(imagesToDelete.filter((id) => id !== imageId));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    const newPreviews = newImages.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setError('');
    // return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  };

  const handleDeleteExistingImage = (imageId) => {
    const remainingImages = existingImages.length - imagesToDelete.length - 1;
    const totalAfterDelete = remainingImages + newImages.length;

    if (totalAfterDelete < 1) {
      setError('Property must have at least one image');
      return;
    }

    setImagesToDelete([...imagesToDelete, imageId]);
    setError('');
  };

  const handleNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length - imagesToDelete.length + files.length;

    if (totalImages > 10) {
      setError('Maximum 10 images allowed per property');
      return;
    }
    setNewImages(files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);
    setError('');
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  };

  const handleSubmitImages = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Step 1: Delete marked images one by one
      if (imagesToDelete.length > 0) {
        for (const imageId of imagesToDelete) {
          await propertyAPI.deletePropertyImage(propertyId, imageId);
        }
      }

      // Step 2: Add new images (this will append to existing images)
      if (newImages.length > 0) {
        // Get current image count after deletions
        const currentImageCount = existingImages.length - imagesToDelete.length;

        const imageData = new FormData();
        newImages.forEach((image) => imageData.append('images', image));

        // Use a different endpoint for adding images (not replacing)
        await propertyAPI.addPropertyImages(propertyId, imageData);
      }

      // Step 3: Reload property to get updated images
      await loadProperty();
      setNewImages([]);
      setImagesToDelete([]);
      setImageUpdateMode(false);

      setSuccessMessage('Images updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update images');
    } finally {
      setLoading(false);
    }
  };

  const handleReplaceAllImages = async (e) => {
    e.preventDefault();
    // checks if there are images to upload
    if (newImages.length === 0) {
      setError('Please select new images to upload');
      return;
    }
    // checks if there are more than 10 images selected
    if (newImages.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const imageData = new FormData();
      newImages.forEach((image) => imageData.append('images', image));
      // This endpoint replaces all images
      await propertyAPI.updatePropertyImages(propertyId, imageData);
      await loadProperty();

      setNewImages([]);
      setImagesToDelete([]);
      setImageUpdateMode(false);

      setSuccessMessage('All images replaced successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to replace images');
    } finally {
      setLoading(false);
    }
  };

  // console.log(previews);
  // console.log(newImages);

  const remainingImagesCount = existingImages.length - imagesToDelete.length;
  const totalImagesAfterChanges = remainingImagesCount + newImages.length;

  if (initialLoading) {
    return <Loading />;
  }

  return (
    <div className={styles.editForm}>
      {error && <div className='error-message'>{error}</div>}
      {successMessage && (
        <div className='success-message'>{successMessage}</div>
      )}

      {/* Property Details Section */}
      <div className={styles.section}>
        <h2>Property Details</h2>
        <form onSubmit={handleSubmitDetails}>
          <div className='form-group'>
            <label htmlFor='title' className='form-label'>
              Title
            </label>
            <input
              type='text'
              name='title'
              id='title'
              className='form-input'
              onChange={handleChange}
              value={formData.title}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='description' className='form-label'>
              Description
            </label>
            <textarea
              name='description'
              id='description'
              className='form-textarea'
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className={styles.row}>
            <div className='form-group'>
              <label htmlFor='property_type' className='form-label'>
                Property Type
              </label>
              <select
                name='property_type'
                id='property_type'
                className='form-select'
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

            <div className='form-group'>
              <label htmlFor='listing_type' className='form-label'>
                Listing Types
              </label>
              <select
                name='listing_type'
                id='listing_type'
                className='form-select'
                value={formData.listing_type}
                onChange={handleChange}
              >
                <option value='sale'>For Sale</option>
                <option value='rent'>For Rent</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className='form-group'>
              <label htmlFor='price' className='form-label'>
                Price
              </label>
              <input
                type='number'
                className='form-input'
                name='price'
                id='price'
                min='0'
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            {formData.listing_type === 'rent' && (
              <div className='form-group'>
                <label htmlFor='rental_period' className='form-label'>
                  Rental Period
                </label>
                <select
                  name='rental_period'
                  id='rental_period'
                  className='form-select'
                  value={formData.rental_period}
                  onChange={handleChange}
                >
                  <option value='day'>Per Day</option>
                  <option value='week'>Per Week</option>
                  <option value='month'>Per Month</option>
                  <option value='year'>Per Year</option>
                </select>
              </div>
            )}

            <div className='form-group'>
              <label htmlFor='status' className='form-label'>
                Status
              </label>
              <select
                name='status'
                id='status'
                className='form-select'
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

          <div className={styles.row}>
            <div className='form-group'>
              <label htmlFor='bedrooms' className='form-label'>
                Bedrooms
              </label>
              <input
                type='number'
                className='form-input'
                name='bedrooms'
                id='bedrooms'
                value={formData.bedrooms}
                onChange={handleChange}
                min='0'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='bathrooms' className='form-label'>
                Bathrooms
              </label>
              <input
                type='number'
                className='form-input'
                name='bathrooms'
                id='bathrooms'
                value={formData.bathrooms}
                onChange={handleChange}
                min='0'
              />
            </div>

            <div className='form-group'>
              <label htmlFor='area_sqft' className='form-label'>
                Area (sqft)
              </label>
              <input
                type='number'
                className='form-input'
                name='area_sqft'
                id='area_sqft'
                min='0'
                value={formData.area_sqft}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className='form-group'>
            <label htmlFor='address' className='form-label'>
              Address
            </label>
            <input
              type='text'
              className='form-input'
              name='address'
              id='address'
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <div className='form-group'>
              <label htmlFor='city' className='form-label'>
                City *
              </label>
              <input
                type='text'
                className='form-input'
                name='city'
                id='city'
                value={formData.city}
                onChange={handleChange}
                disabled
              />
            </div>
            <div className='form-group'>
              <label className='form-label'>State *</label>
              <input
                type='text'
                name='state'
                value={formData.state}
                onChange={handleChange}
                className='form-input'
                required
                disabled
              />
            </div>

            <div className={styles.row}>
              <div className='form-group'>
                <label className='form-label'>ZIP Code *</label>
                <input
                  type='text'
                  name='zip_code'
                  value={formData.zip_code}
                  onChange={handleChange}
                  className='form-input'
                  required
                />
              </div>
            </div>
            <div className='form-group'>
              <label className='form-label'>Country *</label>
              <input
                type='text'
                name='country'
                value={formData.country}
                onChange={handleChange}
                className='form-input'
                requiredSS
                disabled
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
          <div className={styles.imageCount}>
            <span className={styles.countBadge}>
              {totalImagesAfterChanges} / 10 images
            </span>
          </div>
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
          {existingImages.length === 0 ? (
            <p className={styles.noImages}>No images uploaded yet</p>
          ) : (
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
                            onClick={() => handleUndoDeleteImage(image.id)}
                          >
                            Undo
                          </button>
                        ) : (
                          <button
                            className={styles.deleteBtn}
                            type='button'
                            onClick={() => handleDeleteExistingImage(image.id)}
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
          )}
        </div>

        {imageUpdateMode && (
          <>
            {/* Add New Images */}
            <div className={styles.addImages}>
              <h3>Add New Images</h3>
              <p className={styles.addImagesHint}>
                You can add up to {10 - remainingImagesCount} more image(s)
              </p>
              <ImagePicker
                onImagesChange={setNewImages}
                maxFiles={10 - remainingImagesCount}
              />
              {/* <div className='form-group'>
                <input
                  type='file'
                  multiple
                  accept='image/*'
                  className='form-input'
                  onChange={handleNewImagesChange}
                  disabled={remainingImagesCount >= 10}
                />
                {newImages.length > 0 && (
                  <p className={styles.imageCount}>
                    {newImages.length} new image(s) selected
                  </p>
                )}
              </div> */}

              {/* {newImages.length > 0 && (
                <div className={styles.newImagesPreviews}>
                  {previews.map((url, index) => (
                    <div key={url} className={styles.previewItem}>
                      <div className={styles.previewImageWrapper}>
                        <img
                          src={url}
                          alt={`New image ${index + 1}`}
                          className={styles.previewImage}
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveNewImage(index)}
                        >
                          ✕
                        </button>
                      </div>
                      <span>New #{index + 1}</span>
                    </div>
                  ))}
                </div>
              )} */}
            </div>

            {/* Summary */}
            {(imagesToDelete.length > 0 || newImages.length > 0) && (
              <div className={styles.changesSummary}>
                <h4>Pending Changes:</h4>
                <ul>
                  {imagesToDelete.length > 0 && (
                    <li className={styles.deleteSummary}>
                      Will delete {imagesToDelete.length} image(s)
                    </li>
                  )}
                  {newImages.length > 0 && (
                    <li className={styles.addSummary}>
                      Will add {newImages.length} new image(s)
                    </li>
                  )}
                  <li>
                    <strong>
                      Total after changes: {totalImagesAfterChanges} / 10 images
                    </strong>
                  </li>
                </ul>
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.buttonGroup}>
              <button
                type='button'
                onClick={handleSubmitImages}
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
                onClick={handleReplaceAllImages}
              >
                Replace All Images
              </button>
            </div>

            <div className={styles.helpText}>
              <p>
                <strong>&quot;Apply Changes&quot;</strong> will delete marked
                images and add new ones to your existing collection.
              </p>
              <p>
                <strong>&quot;Replace All Images&quot;</strong> will remove ALL
                current images and upload only the new ones you&apos;ve
                selected.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
