import { BASE_URL } from '@/utils/api';
import axios from 'axios';

export const getTypes = async () => {
  try {
    const { data, status } = await axios.get(`${BASE_URL}/types`, {
      method: 'GET',
      cache: 'no-cache',
      withCredentials: true,
    });

    if (status !== 200) {
      throw new Error('Error fetching types');
    }

    return data;
  } catch (error) {
    console.error('Error fetching types:', error.message);
    return { types: [] };
  }
};

export const getSpecialties = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/types`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error('Error fetching specialties');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching specialties:', error.message);
    throw error;
  }
};
