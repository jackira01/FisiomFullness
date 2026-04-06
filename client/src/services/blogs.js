import { BASE_URL } from '@/utils/api';
import axios from 'axios';

export const getBlogs = async ({
  page = 1,
  limit = 9,
  professionalId,
  sortBy,
  order,
  search = '',
  status,
}) => {
  let query = `?page=${page}&limit=${limit}`;
  if (professionalId) query += `&professionalId=${professionalId}`;
  if (search !== '') query += `&search=${search}`;
  if (sortBy && order) query += `&sortBy=${sortBy}&order=${order}`;
  if (status) query += `&status=${status}`;

  try {
    const res = await axios.get(`${BASE_URL}/blogs${query}`, {
      withCredentials: true,
      next: { revalidate: 20 }, // ? Revalidate last blogs after 20 seconds
    });
    if (res.status !== 200) throw new Error('Error fetching blogs');
    return res.data;
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    return { blogs: [], totalBlogs: 0, hasMoreToLoad: false, totalPages: 0 };
  }
};

export const getProfessionalBlogs = async (
  professionalId,
  { page = 1, limit = 6 }
) => {
  let query = `?page=${page}&limit=${limit}`;

  const { data, status } = await axios.get(`${BASE_URL}/blogs/${professionalId}${query}`, {
    credentials: 'include',
    next: { revalidate: 60 },
  });
  if (status !== 200) throw new Error('Error fetching blogs');

  return data;
};

export const getBlogDetail = async (blogId) => {
  const { data, status } = await axios.get(`${BASE_URL}/blogs/detail/${blogId}`, {
    cache: 'no-cache',
  });
  if (status !== 200) throw new Error('Error fetching blogs');
  return data;
};

export const createBlog = async (newBlog, token) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const { data, status } = await axios.post(`${BASE_URL}/blogs/create`, newBlog, {
    withCredentials: true,
    headers,
  });
  if (status !== 200) throw new Error('Error fetching blogs');
  return data;
};

export const updateBlog = async (blogId, updatedBlog, token) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const { data, status } = await axios.put(`${BASE_URL}/blogs/update/${blogId}`, updatedBlog, {
    withCredentials: true,
    headers,
  });
  if (status !== 200) throw new Error('Error fetching blogs');
  return data;
};

// ? Logic delete
export const deleteBlog = async (blogId, token) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const { data, status } = await axios.patch(`${BASE_URL}/blogs/status/${blogId}`, { status: false }, {
    withCredentials: true,
    headers,
  });
  if (status !== 200) throw new Error('Error fetching blogs');
  return data;
};
