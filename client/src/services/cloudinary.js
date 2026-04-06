import axios from 'axios';

const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_NAME;
const upload_preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_FOLDERS = {
  users: 'FisiumFulness/users',
  blogs: 'FisiumFulness/blogs',
  products: 'FisiumFulness/products',
};

/**
 * Sube un único archivo de imagen a Cloudinary desde el frontend.
 * @param {File} file - Archivo de imagen a subir
 * @param {'users'|'blogs'|'products'} folder - Carpeta de destino en Cloudinary
 * @returns {Promise<{ secure_url: string, public_id: string }>}
 */
export const uploadImageToCloudinary = async (file, folder = 'users') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', upload_preset);
  formData.append('resource_type', 'image');
  formData.append('folder', CLOUDINARY_FOLDERS[folder]);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    formData
  );

  return { secure_url: data.secure_url, public_id: data.public_id };
};
