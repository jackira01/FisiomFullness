import { apiEndpoints } from '@/api_endpoints';
import { BASE_URL } from '@/utils/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const normalizeText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

const buildSpecialties = (user = {}) => {
  const specialties = [];

  if (typeof user.specialty === 'string' && user.specialty.trim()) {
    specialties.push(user.specialty.trim());
  }

  if (Array.isArray(user.specialties)) {
    user.specialties.forEach((specialty) => {
      if (typeof specialty === 'string' && specialty.trim()) {
        specialties.push(specialty.trim());
      }

      if (
        specialty &&
        typeof specialty === 'object' &&
        typeof specialty.name === 'string' &&
        specialty.name.trim()
      ) {
        specialties.push(specialty.name.trim());
      }
    });
  }

  return [...new Set(specialties)].map((name) => ({
    _id: normalizeText(name) || name,
    name,
  }));
};

export const getProfessionals = async (filters = {}) => {
  try {
    const {
      search = '',
      city = '',
      state = '',
      country = '',
      specialtyId = '',
      position = '',
      page = 1,
      limit = 12,
    } = filters;

    const params = new URLSearchParams();
    params.append('role', 'professional');
    if (search) params.append('search', search);
    if (city) params.append('city', city);
    if (state) params.append('state', state);
    if (country) params.append('country', country);
    if (specialtyId) params.append('specialtyId', specialtyId);
    if (position) params.append('position', position);
    params.append('page', page);
    params.append('limit', limit);

    const response = await axios.get(
      `${BASE_URL}/users?${params.toString()}`,
      { withCredentials: true }
    );

    // Filter only professional users and transform data to match frontend expectations
    // El backend ya filtra por role=professional, no es necesario re-filtrar en cliente
    const transformedUsers = (response.data.users || [])
      .map(user => {
        return {
          ...user,
          name: `${user.firstname || ''} ${user.lastname || ''}`.trim(),
          specialties: buildSpecialties(user),
          address: {
            city: user.address?.city || user.city || '',
            state: user.address?.state || user.state || '',
            country: user.address?.country || user.country || '',
          },
          rating: {
            average: 0, // Placeholder - add rating calculation later
          },
          consultationPrice: user.consultationPrice || '-',
          // NOTE: Keep original location structure from backend for Leaflet map
          // user.location.coordinates is already in GeoJSON format [lng, lat]
        };
      });

    return {
      ...response.data,
      users: transformedUsers,
    };
  } catch (error) {
    console.error('Error fetching professionals:', error);
    throw error;
  }
};

export const getProfessionalFilters = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users/professionals/filters`, {
      withCredentials: true,
    });

    if (response.status !== 200) {
      throw new Error('Error fetching professional filters');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching professional filters:', error);
    throw error;
  }
};

export const getProfessionalDetail = async (professionalId) => {
  try {
    const response = await axios.get(
      apiEndpoints.professionalsDetail + professionalId,
      { withCredentials: true }
    );
    // El backend devuelve { user } pero las páginas esperan { professional }
    const raw = response.data.user || response.data.professional || response.data;
    const professional = {
      ...raw,
      name: `${raw.firstname || ''} ${raw.lastname || ''}`.trim() || raw.username || '',
      specialties: buildSpecialties(raw),
      rating: raw.rating || { average: 0 },
      experience: Array.isArray(raw.experience) ? raw.experience : [],
      coordinates: Array.isArray(raw.coordinates) ? raw.coordinates : [0, 0],
      description: raw.description || '',
      phone: raw.phone || '',
    };
    return { professional };
  } catch (error) {
    throw error;
  }
};

export const getProfessionalRatings = async (
  professionalId,
  offset = 0,
  limit = 30
) => {
  try {
    const response = await axios.get(
      `${apiEndpoints.professionalRating + professionalId
      }?offset=${offset}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return { comments: [], hasMoreToLoad: false };
    }
    throw error;
  }
};

export const hasUserCommented = async (professionalId, userId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/professionals/rating/${professionalId}/${userId}/hasCommented`
    );
    return response.data.hasCommented;
  } catch (error) {
    if (error?.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

export const addExperience = async (professionalId, newExperience) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/professionals/${professionalId}/experience`,
      newExperience,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateExperience = async (
  professionalId,
  experienceId,
  updatedExperience
) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/professionals/${professionalId}/experience/${experienceId}`,
      updatedExperience,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteExperience = async (professionalId, experienceId) => {
  try {
    const response = await axios.delete(
      `${BASE_URL}/professionals/${professionalId}/experience/${experienceId}`,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAvailability = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/professionals/availability/${userId}`
    )
    return response.data.availability || []
  } catch (error) {
    throw error
  }
}

export const postAvailability = async (userId, newData) => {
  /* return toast.promise(axios.post(`${BASE_URL}/professionals/availability/${userId}`
    , newData), {
    loading: "Actulizando Disponibilidad...",
    success: (response) => response.data.message,
    error: 'Ups! Algo salio mal...'
  }) */
  try {
    const response = await axios.post(`${BASE_URL}/professionals/availability/${userId}`, newData)
    toast.success(response.data.message)
    return response.data.userAvailability
  } catch (error) {
    console.log(error);
    return toast.error(error.response.message)
  }
}

export const createService = async (values) => {
  try {
    const response = await axios.post(`${BASE_URL}/services`, values, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getServices = async ({
  limit = 100,
  offset = 0,
  page = 1,
  professionalId,
}) => {
  let query = `?offset=${offset}&limit=${limit}&page=${page}`;
  if (professionalId) query += `&professionalId=${professionalId}`;
  try {
    const response = await axios.get(`${BASE_URL}/services${query}`);
    return response.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return { services: [] };
    }
    throw error;
  }
};

export const updateService = async (serviceId, newValues) => {
  try {
    const response = await axios.put(
      `${BASE_URL}/services/${serviceId}`,
      newValues,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (serviceId) => {
  try {
    const response = await axios.delete(`${BASE_URL}/services/${serviceId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const getPendingProfessionals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/professionals/pending`, {
      withCredentials: true,
    });
    return { data: response.data };
  } catch (error) {
    toast.error("Error al obtener profesionales pendientes");
    return { data: null, error };
  }
};

export const acceptProfessional = async (professionalId) => {
  try {
    console.log(`Aprobando profesional con ID: ${professionalId}`);

    const response = await axios.put(
      `${BASE_URL}/professionals/approve/${professionalId}`,
      {},
      { withCredentials: true }
    );

    toast.success("Profesional aceptado con éxito");
    return response.data;
  } catch (error) {
    console.error("Error al aceptar profesional:", error);
    toast.error("Error al aceptar profesional");
    throw error;
  }
};

