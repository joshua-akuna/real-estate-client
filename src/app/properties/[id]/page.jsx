import { propertyAPI } from '@/services/apiService';
import PropertyDetail from './PropertyDetail';

export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const response = await propertyAPI.getProperty(id);
    const property = response.data?.property;

    return {
      title: `${property.title} - Real Estate App`,
      description: property.description,
    };
  } catch (error) {
    return { title: 'Property Not Found' };
  }
}

export default async function PropertyPage({ params }) {
  const { id } = await params;
  let property = null;
  let error = null;

  try {
    const response = await propertyAPI.getProperty(id);
    property = response.data?.property;
  } catch (error) {
    error = 'Property not found';
  }

  if (error || !property) {
    return (
      <div
        className='container'
        style={{ padding: '80px 20px', textAlign: 'center' }}
      >
        <h1>Property Not Found</h1>
        <p>The property you are looking for doesn&apos;t exist.</p>
      </div>
    );
  }
  return <PropertyDetail property={property} />;
}
