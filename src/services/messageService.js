import api from './api';

export const sendMessage = data => api.post('/messages', data).then(res => res.data);
export const getConversation = userId => api.get(`/messages/${userId}`).then(res => res.data);
