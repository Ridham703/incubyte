import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/v1/cars';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCars = async (params = {}) => {
  const response = await api.get('/', { params });
  return response.data;
};

export const fetchCarById = async (id) => {
  const response = await api.get(`/${id}`);
  return response.data;
};

export const fetchCarStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const createCar = async (carData) => {
  const response = await api.post('/', carData);
  return response.data;
};

export const updateCar = async (id, carData) => {
  const response = await api.put(`/${id}`, carData);
  return response.data;
};

export const updateCarStatus = async (id, status) => {
  const response = await api.patch(`/${id}/status`, { status });
  return response.data;
};

export const deleteCar = async (id) => {
  const response = await api.delete(`/${id}`);
  return response.data;
};
