import { propertyAPI } from '@/services/apiService';
import FiltersForm from '@/components/ui/FiltersForm';
import styles from './properties.module.css';
import { Suspense } from 'react';
import Loading from '@/components/ui/Loading';
import PropertyCard from '@/components/ui/PropertyCard';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';

export default async function PropertiesPage({ searchParams }) {
  const params = await searchParams;
  const filters = {
    page: params.page || 1,
    limit: params.limit || 12,
    listing_type: params.listing_type || '',
    property_type: params.property_type || '',
    city: params.city || '',
    min_price: params.min_price || '',
    max_price: params.max_price || '',
  };

  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v !== ''),
  );

  let properties = [];
  let pagination = null;

  try {
    const response = await propertyAPI.getProperties(cleanFilters);
    properties = response.data?.properties ?? [];
    pagination = response.data?.pagination ?? null;
  } catch (error) {
    console.error('Error loading properties:', error);
  }

  const currentPage = Number(filters.page);
  const totalPages = pagination?.totalPages ?? 1;

  function buildPageUrl(page) {
    const p = new URLSearchParams({ ...params, page });
    // console.log(`/properties?${p.toString()}`);
    return `/properties?${p.toString()}`;
  }
  // console.log('Properties:', properties);
  return (
    <div className={styles.page}>
      <div className='container'>
        <div className={styles.header}>
          <h1>Browse Properties</h1>
          <p>Find your perfect home or investment</p>
        </div>

        <FiltersForm filters={filters} />

        <Suspense fallback={<Loading />}>
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
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  {currentPage > 1 && (
                    <Link href={buildPageUrl(currentPage - 1)}>Previous</Link>
                  )}
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                  {currentPage < totalPages && (
                    <Link href={buildPageUrl(currentPage + 1)}>Next</Link>
                  )}
                </div>
              )}
            </>
          )}
        </Suspense>
      </div>
    </div>
  );
}
