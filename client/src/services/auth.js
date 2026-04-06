import { BASE_URL } from '@/utils/api';

export const verifyToken = async () => {
  let res = await fetch(`${BASE_URL}/auth/verify-token`, {
    method: 'GET',
    credentials: 'include',
  });
  if (res.ok) return await res.json();

  res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!res.ok) return null; 

  const data = await res.json();
  return data; 
};

export const serverSideVerify = async (cookieValue) => {
  try {
    const res = await fetch(`${BASE_URL}/auth/verify-token`, {
      method: 'GET',
      headers: {
        'Cookie': `accessToken=${cookieValue}`, 
      },
    });
    
    if (!res.ok) {
      throw new Error('No autorizado');
    }
    return await res.json();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    throw error; 
  }
};