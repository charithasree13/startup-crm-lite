import api from './api';

/**
 * Service managing user authentication operations.
 * Stateless backend interacts using JWT tokens.
 */
export const register = async (name, email, password) => {
  // Derive username and mobile number to satisfy mandatory backend fields
  const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
  const username = baseUsername.length >= 3 ? baseUsername : `user_${Math.random().toString(36).substring(2, 6)}`;
  const mobile = '0000000000'; // fallback mobile number to pass validation

  const response = await api.post('/api/auth/register', {
    name,
    username,
    mobile,
    email,
    password,
  });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/api/auth/login', { email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('crm-token');
};

export const getProfile = async () => {
  const response = await api.get('/api/auth/profile');
  return response.data;
};

export const updateProfile = async (data) => {
  const response = await api.put('/api/auth/profile', data);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
};

export default authService;
