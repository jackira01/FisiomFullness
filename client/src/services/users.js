import { BASE_URL } from "@/utils/api";
import { getErrorMessage } from "@/utils/utils";
import { uploadImageToCloudinary } from "@/services/cloudinary";
import axios from "axios";
import toast from "react-hot-toast";

//#region Login
export const axiosLogin = async (user) => {
  return toast.promise(
    axios.post(`${BASE_URL}/login`, user, {
      withCredentials: true,
    }),
    {
      loading: "Iniciando Sesion...",
      success: (response) => response.data.message,
      error: (error) => {
        if (error.response) {
          return error.response.data.message;
        } else {
          return error.message;
        }
      },
    }
  );
};

//#region Register user
export const axiosRegisterUserForm = async (user) => {
  let imageUrl = undefined;
  if (user.image instanceof File) {
    const { secure_url } = await uploadImageToCloudinary(user.image, 'users');
    imageUrl = secure_url;
  }

  const payload = {
    email: user.email,
    password: user.password,
    username: user.email.split("@")[0],
    firstname: user.name || "",
    ...(user.phone && { phone: user.phone }),
    ...(imageUrl && { image: imageUrl }),
  };

  return toast.promise(
    axios.post(`${BASE_URL}/users/create`, payload, {
      withCredentials: true,
    }),
    {
      loading: "Registrandose...",
      success: (response) => {
        return response.data.message || "Usuario registrado exitosamente";
      },
      error: (error) => {
        if (error.response && error.response.data) {
          return error.response.data.message || "Error al registrar el usuario";
        } else if (error.message) {
          return error.message;
        } else {
          return "Error desconocido al registrar";
        }
      },
    }
  );
};

//#region Register professional
export const axiosRegisterProfessionalForm = async (user) => {
  return toast.promise(
    axios.post(`${BASE_URL}/register/professional`, user, {
      withCredentials: true,
    }),
    {
      loading: "Registrandose...",
      success: (response) => {
        // Retornar el mensaje del servidor o un mensaje por defecto
        return response.data.message || "Registro completado. Pendiente de aprobación";
      },
      error: (error) => {
        // Manejar diferentes tipos de errores
        if (error.response && error.response.data) {
          return error.response.data.message || "Error al registrar el usuario";
        } else if (error.message) {
          return error.message;
        } else {
          return "Error desconocido al registrar";
        }
      },
    }
  );
};

export const getUserDetail = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/users/detail/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const { data } = await axios(
      `${BASE_URL}/users/all`
      // `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
    );
    return { data };
  } catch (error) {
    return {
      error: getErrorMessage(error),
    };
  }
};

export const updateUser = (id, newValues) => {
  return axios.put(`${BASE_URL}/users/update/${id}`, newValues, {
    withCredentials: true,
  });
};

export const updateProfessional = (id, newValues) => {
  return axios.put(`${BASE_URL}/professionals/update/${id}`, newValues, {
    withCredentials: true,
  });
};

// * Works with every account
export const verifyCredentials = async (email, password) => {
  try {
    await axios.post(`${BASE_URL}/users/verify-credentials`, {
      email,
      password,
    });
    return true;
  } catch (error) {
    toast.error(
      error.response.data.message ||
      "No se pudieron verificar las credenciales de la cuenta",
      {
        className: "text-center",
      }
    );
    return false;
  }
};

// ? Cookie is httpOnly for more security, this is needed.
export const httpLogout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Oops! vuelva a intentarlo mas tarde..");
  return await res.json();
};

//#region getSpecificUserData
//trae de la API el listado de usuarios (nombre y email) para el selector de pacientes
export const getSpecificUserData = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    return response;
  } catch (error) {
    return error;
  }
};
