'use client';

import { usePathname, useRouter } from 'next/navigation';
import styles from './FiltersForm.module.css';

export default function FiltersForm({ filters }) {
  const router = useRouter();
  const pathname = usePathname();

  function handleFilterChange(e) {
    const { name, value } = e.target;
    const params = new URLSearchParams();
    Object.entries({ ...filters, [name]: value, page: 1 }).forEach(([k, v]) => {
      if (v !== '') params.set(k, v);
    });
    // console.log('Params:', params);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className=''>
      <div className={styles.filters}>
        <select
          name='listing_type'
          id='listing_type'
          aria-label='listing_type'
          className='form-select'
          defaultValue={filters.listing_type}
          onChange={handleFilterChange}
        >
          <option value=''>All Listings</option>
          <option value='sale'>For Sale</option>
          <option value='rent'>For Rent</option>
        </select>

        <select
          name='property_type'
          id='property_type'
          defaultValue={filters.property_type}
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
          defaultValue={filters.city}
          onBlur={handleFilterChange}
          onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(e)}
          placeholder='City'
          className='form-input'
          aria-label='city'
        />

        <input
          type='number'
          name='min_price'
          id='min_price'
          defaultValue={filters.min_price}
          onBlur={handleFilterChange}
          onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(e)}
          placeholder='Min Price'
          className='form-input'
          aria-label='minimum price'
        />

        <input
          type='number'
          name='max_price'
          id='max_price'
          defaultValue={filters.max_price}
          onBlur={handleFilterChange}
          onKeyDown={(e) => e.key === 'Enter' && handleFilterChange(e)}
          placeholder='Max Price'
          className='form-input'
          aria-label='maximum price'
        />
      </div>
    </div>
  );
}
