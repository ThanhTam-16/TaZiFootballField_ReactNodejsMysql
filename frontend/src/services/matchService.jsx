// services/matchService.js
import API from './api';

// Lấy danh sách kèo theo bộ lọc
export const fetchMatches = async (filter = {}) => {
  const res = await API.get('/matches', { params: filter });
  return res.data;
};

// Tạo kèo mới
export const createMatch = async (data) => {
  const res = await API.post('/matches', data);
  return res.data;
};

// Xin vào đội
export const joinMatch = async (match_id, user_id) => {
  const res = await API.post('/matches/join', { match_id, user_id });
  return res.data;
};
