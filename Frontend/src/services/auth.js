import API from './api';

const login = async (username, password) => {
  const response = await API.post('/auth/login', { username, password });
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};

const register = (username, password) => {
  return API.post('/auth/register', { username, password });
};

const logout = () => {
  localStorage.removeItem('token');
};

export default { login, register, logout };
