export const formatPrice = (price, rental_period = null) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (rental_period) {
    const periodMap = {
      day: 'day',
      week: 'week',
      month: 'month',
      year: 'year',
    };
    return `${formatted} / ${periodMap[rental_period]}`;
  }
  return formatted;
};

export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const getPropertyTypeLabel = (type) => {
  const labels = {
    house: 'House',
    apartment: 'Apartment',
    condo: 'Condo',
    townhouse: 'Townhouse',
    land: 'Land',
  };
  return labels[type] || type;
};

export const getListingTypeLabel = (type) => {
  const labels = {
    sale: 'For Sale',
    rent: 'For Rent',
  };
  return labels[type] || type;
};
