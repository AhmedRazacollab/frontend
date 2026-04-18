import api from './api';

export const fetchNotifications = () => api.get('/notifications').then(res => res.data);
export const markNotificationRead = id => api.put(`/notifications/${id}/read`).then(res => res.data);
