import api from './api';

export const createRequest = data => api.post('/requests', data).then(res => res.data);
export const fetchRequests = params => api.get('/requests', { params }).then(res => res.data);
export const fetchRequestById = id => api.get(`/requests/${id}`).then(res => res.data);
export const applyToHelp = id => api.post(`/requests/${id}/apply`).then(res => res.data);
export const completeRequest = id => api.post(`/requests/${id}/complete`).then(res => res.data);
export const requestAISuggestions = data => api.post('/ai/request', data).then(res => res.data);
export const getAISearchSuggestions = query => api.get('/requests/ai/search-suggestions', { params: { query } }).then(res => res.data);
