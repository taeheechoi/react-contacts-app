import axios from 'axios';

export default (history = null) => {
  const baseURL = process.env.REACT_APP_BACKEND_URL;
  const headers = {};

  if (localStorage.token) {
    headers.Authorization = `Bearer ${localStorage.token}`;
  }

  const axiosInstance = axios.create({
    baseURL,
    headers,
  });

  axiosInstance.interceptors.response.use(
    (response) => new Promise((resolve) => {
      resolve(response);
    }),
    (error) => {
      // when error is not from server
      if (!error.response) {
        return new Promise((resolve, reject) => {
          reject(error);
        });
      }

      if (error.response.status === 403) {
        localStorage.removeItem('token');
        if (history) {
          history.push('/auth/login');
        } else {
          window.location = '/auth/login';
        }
      }
      return new Promise((resolve, reject) => {
        reject(error);
      });
    },
  );

  return axiosInstance;
};
