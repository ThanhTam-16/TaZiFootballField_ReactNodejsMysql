// services/teamJoinService.jsx - Fixed Customer Service
import API from './api';

export const fetchTeamJoinPosts = async (filter = {}) => {
  const res = await API.get('/team-joins', { params: filter }); // Fixed endpoint
  return res.data;
};

export const createTeamJoinPost = async (data) => {
  const res = await API.post('/team-joins', data); // Fixed endpoint
  return res.data;
};

export const getTeamJoinPostById = async (id) => {
  const res = await API.get(`/team-joins/${id}`);
  return res.data;
};

export const updateTeamJoinPost = async (id, data) => {
  const res = await API.put(`/team-joins/${id}`, data);
  return res.data;
};

export const deleteTeamJoinPost = async (id) => {
  const res = await API.delete(`/team-joins/${id}`);
  return res.data;
};