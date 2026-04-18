import api from './api';

export const register = data => api.post('/auth/register', data).then(res => res.data);
export const login = data => api.post('/auth/login', data).then(res => res.data);
export const updateProfile = data => api.put('/users/update', data).then(res => res.data);
export const fetchProfile = () => api.get('/users/profile').then(res => res.data);
export const fetchLeaderboard = () => api.get('/users/leaderboard').then(res => res.data);
