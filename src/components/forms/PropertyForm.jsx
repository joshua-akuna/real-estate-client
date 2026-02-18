'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Country, State, City } from 'country-state-city';
import Select from 'react-select';
import { propertyAPI } from '@/services/apiService';
import styles from './PropertyForm.module.css';

export default function PropertyForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: '',
    listing_type: '',
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
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState(null);
  const [state, setState] = useState(null);
  const [city, setCity] = useState(null);
  const router = useRouter();

  // 1. Prepare Countries (Static, once)
  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.isoCode,
    label: country.name,
  }));

  //   2. Prepare States (Depend on country)
  const stateOptions = country
    ? State.getStatesOfCountry(country.value).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }))
    : [];

  const cityOptions = state
    ? City.getCitiesOfState(country.value, state.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  function handleCountryChange(selected) {
    setCountry(selected);
    setState(null); // Resets state
    setCity(null); // Resets state
  }

  function handleStateChange(selected) {
    setState(selected);
    setCity(null); // Resets state
  }

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // clears rental_period if listing_type is sale
    if (name === 'listing_type' && value === 'sale') {
      setFormData((prev) => ({ ...prev, rental_period: '' }));
    }
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();

      // Append text fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      data.append('country', country.label);
      data.append('state', state.label);
      data.append('city', city.label);

      //   Append images
      images.forEach((image) => {
        data.append('images', image);
      });
      //   console.log('All images:', data.getAll('images'));
      //   console.log(Object.fromEntries(data));
      await propertyAPI.createProperty(data);
      router.push('/properties/my-properties');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create property');
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    // const files = Array.from(e.target.files);
    const files = [...e.target.files];
    if (files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }
    setImages(files);
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className='error-message'>{error}</div>}

      <div className='form-group'>
        <label htmlFor='title' className='form-label'>
          Title *
        </label>
        <input
          type='text'
          name='title'
          id='title'
          value={formData.title}
          onChange={handleChange}
          className='form-input'
          required
        />
      </div>

      <div className='form-group'>
        <label htmlFor='description' className='form-label'>
          Description *
        </label>
        <textarea
          name='description'
          id='description'
          value={formData.description}
          onChange={handleChange}
          className='form-textarea'
          required
        />
      </div>

      <div className={styles.row}>
        <div className='form-group'>
          <label htmlFor='property_type' className='form-label'>
            Property Type *
          </label>
          <select
            name='property_type'
            id='property_type'
            value={formData.property_type}
            onChange={handleChange}
            className='form-select'
            required
          >
            <option value='' selected disabled hidden>
              Select an option
            </option>
            <option value='house'>House</option>
            <option value='apartment'>Apartment</option>
            <option value='condo'>Condo</option>
            <option value='townhouse'>Townhouse</option>
            <option value='land'>Land</option>
          </select>
        </div>

        <div className='form-group'>
          <label htmlFor='listing_type' className='form-label'>
            Listing Type *
          </label>
          <select
            name='listing_type'
            id='listing_type'
            className='form-select'
            value={formData.listing_type}
            onChange={handleChange}
            required
          >
            <option value='' selected disabled hidden>
              Select an option
            </option>
            <option value='rent'>For Rent</option>
            <option value='sale'>For Sale</option>
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className='form-group'>
          <label htmlFor='price' className='form-label'>
            Price *
          </label>
          <input
            type='number'
            name='price'
            id='price'
            value={formData.price}
            onChange={handleChange}
            className='form-input'
            min='0'
            required
          />
        </div>

        {formData.listing_type === 'rent' && (
          <div className='form-group'>
            <label htmlFor='rental_period' className='form-label'>
              Rental Period *
            </label>
            <select
              name='rental_period'
              id='rental_period'
              className='form-select'
              value={formData.rental_period}
              onChange={handleChange}
              required
            >
              <option value='' selected disabled hidden>
                Select an option
              </option>
              <option value='day'>Per Day</option>
              <option value='week'>Per Week</option>
              <option value='month'>Per Month</option>
              <option value='year'>Per Year</option>
            </select>
          </div>
        )}
      </div>
      <div className={styles.row}>
        <div className='form-group'>
          <label htmlFor='bedrooms' className='form-label'>
            Number of Bedrooms *
          </label>
          <input
            type='number'
            className='form-input'
            name='bedrooms'
            id='bedrooms'
            value={formData.bedrooms}
            onChange={handleChange}
            min='0'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='bathrooms' className='form-label'>
            Number of Bathrooms *
          </label>
          <input
            type='number'
            className='form-input'
            name='bathrooms'
            id='bathrooms'
            value={formData.bathrooms}
            onChange={handleChange}
            min='0'
            required
          />
        </div>

        <div className='form-group'>
          <label htmlFor='area_sqft' className='form-label'>
            Area of Property (sqft)
          </label>
          <input
            type='number'
            className='form-input'
            id='area_sqft'
            name='area_sqft'
            min='0'
            value={formData.area_sqft}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className='form-group'>
        <label htmlFor='address' className='form-label'>
          Address *
        </label>
        <input
          type='text'
          className='form-input'
          name='address'
          id='address'
          value={formData.address}
          onChange={handleChange}
          required
        />
      </div>

      <div className={styles.row}>
        <div className='form-group'>
          <label className='form-label'>Country *</label>
          <Select
            className='form-input'
            instanceId='country-select'
            id='country'
            aria-label='country'
            options={countryOptions}
            value={country}
            onChange={handleCountryChange}
            placeholder='Select Country'
            isClearable
            required
          />
        </div>

        <div className='form-group'>
          <label className='form-label'>State *</label>
          <Select
            className='form-input'
            instanceId='state-select'
            id='state'
            aria-label='state'
            options={stateOptions}
            value={state}
            onChange={handleStateChange}
            placeholder='Select State...'
            isDisabled={!country || stateOptions.length === 0}
            isClearable
            required
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className='form-group'>
          <label className='form-label'>City *</label>
          <Select
            id='city'
            instanceId='city-select'
            aria-label='city'
            className='form-input'
            name='city'
            options={cityOptions}
            value={city}
            onChange={setCity}
            placeholder='Select City...'
            isDisabled={!state || cityOptions.length === 0}
            isClearable
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='zip_code' className='form-label'>
            ZIP Code
          </label>
          <input
            type='text'
            name='zip_code'
            id='zip_code'
            value={formData.zip_code}
            onChange={handleChange}
            className='form-input'
          />
        </div>
      </div>

      <div className='form-group'>
        <label htmlFor='images' className='form-label'>
          Primary Images (Max 10)
        </label>
        <input
          id='images'
          className='form-input'
          type='file'
          multiple
          accept='image/*'
          onChange={handleImageChange}
        />
        {images.length > 0 && (
          <p className={styles.imageCount}>
            {images.length} {images.length === 1 ? 'image' : 'images'} selected
          </p>
        )}
      </div>

      <button type='submit' disabled={loading} className='btn btn-primary'>
        {loading ? 'Creating' : 'List Property'}
      </button>
    </form>
  );
}
