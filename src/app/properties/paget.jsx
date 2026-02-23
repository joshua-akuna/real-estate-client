'use client';

import { useEffect, useState } from 'react';
import { propertyAPI } from '@/services/apiService';
import PropertyCard from '@/components/ui/PropertyCard';
import Loading from '@/components/ui/Loading';
import styles from './properties.module.css';
import { useFavorites } from '@/hooks/useFavorites';

export default function PropertiesPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    listing_type: '',
    property_type: '',
    city: '',
    min_price: '',
    max_price: '',
  });
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadProperties = async () => {
      setLoading(true);
      try {
        const cleanFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== ''),
        );
        const response = await propertyAPI.getProperties(cleanFilters);
        setProperties(response.data?.properties);
        setPagination(response.data?.pagination);
      } catch (error) {
        console.error('Error loading properties:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProperties();
  }, [filters]);

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
      page: 1, // Reset to first page when filters change
    });
  }

  // console.log(properties);

  const handlePageChange = (newPage) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>Browse Properties</h1>
          <p>Find your perfect home or investment</p>
        </div>

        <div className={styles.filters}>
          <select
            name='listing_type'
            id='listing_type'
            aria-label='listing_type'
            className='form-select'
            value={filters.listing_type}
            onChange={handleFilterChange}
          >
            <option value=''>All Listings</option>
            <option value='sale'>For Sale</option>
            <option value='rent'>For Rent</option>
          </select>

          <select
            name='property_type'
            id='property_type'
            value={filters.property_type}
            onChange={handleFilterChange}
            className='form-select'
            aria-label='property type'
          >
            <option value=''>All Types</option>
            <option value='house'>House</option>
            <option value='apartment'>Apartment</option>
            <option value='condo'>Condo</option>
            <option value='townhouse'>Townhouse</option>
            <option value='land'>Land</option>
          </select>

          <input
            type='text'
            name='city'
            value={filters.city}
            onChange={handleFilterChange}
            placeholder='City'
            className='form-input'
            aria-label='city'
          />

          <input
            type='number'
            name='min_price'
            id='min_price'
            value={filters.min_price}
            onChange={handleFilterChange}
            placeholder='Min Price'
            className='form-input'
            aria-label='minimum price'
          />

          <input
            type='number'
            name='max_price'
            id='max_price'
            value={filters.max_price}
            onChange={handleFilterChange}
            placeholder='Max Price'
            className='form-input'
            aria-label='maximum price'
          />
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
            {properties.length === 0 ? (
              <div className={styles.noResults}>
                <p>No properties found matching your criteria</p>
              </div>
            ) : (
              <>
                <div className={styles.results}>
                  <p>
                    Showing {properties.length} of {pagination?.totalProperties}{' '}
                    properties
                  </p>
                </div>
                <div className='grid grid-3'>
                  {properties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      onFavoriteToggle={toggleFavorite}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
