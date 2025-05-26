import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const getUsers = (page = 1, limit = 10) =>
  api.get('/users', { params: { page, limit } });
export const createUser = (data: { nome: string; email: string; idade: number }) =>
  api.post('/users', data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);
export const updateUser = (id: number, data: { nome: string; email: string; idade: number }) =>
  api.put(`/users/${id}`, data);