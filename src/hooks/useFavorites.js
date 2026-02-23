import { useCallback, useState } from 'react';
import { favoriteAPI } from '@/services/apiService';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    setLoading(true);
    try {
      const response = await favoriteAPI.getFavorites();
      setFavorites(response.data?.favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleFavorite = async (propertyId) => {
    try {
      const response = await favoriteAPI.toggleFavorite(propertyId);
      return response.data?.isFavorited;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const checkFavorite = async (propertyId) => {
    try {
      const response = await favoriteAPI.checkFavorite(propertyId);
      return response.data.isFavorited;
    } catch (error) {
      console.error('Error checking favorite:', error);
      return false;
    }
  };

  return {
    favorites,
    loading,
    loadFavorites,
    toggleFavorite,
    checkFavorite,
  };
}
