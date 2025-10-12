// services/authService.jsx - Fixed Customer Service
import API from './api';

// Customer Auth
export const sendOtp = async (emailOrPhone) => {
  const data = {};
  
  // Determine if email or phone
  if (emailOrPhone.includes('@')) {
    data.email = emailOrPhone;
  } else {
    data.phone = emailOrPhone;
  }
  
  const res = await API.post('/auth/send-otp', data);
  return res.data;
};

export const verifyOtp = async (emailOrPhone, otp) => {
  const data = { otp };
  
  // Determine if email or phone
  if (emailOrPhone.includes('@')) {
    data.email = emailOrPhone;
  } else {
    data.phone = emailOrPhone;
  }
  
  const res = await API.post('/auth/verify-otp', data);
  return res;
};

// User Profile
export const getUserProfile = async (userId) => {
  const res = await API.get(`/users/${userId}`);
  return res.data;
};

export const updateUserProfile = async (userId, profileData) => {
  const res = await API.put(`/users/${userId}`, profileData);
  return res.data;
};

// Admin Auth
export const adminLogin = async (email, password) => {
  const res = await API.post('/auth/admin/login', { email, password });
  return res.data;
};

export const adminLogout = async () => {
  const token = localStorage.getItem('adminToken');
  const res = await API.post('/auth/admin/logout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const verifyAdminSession = async () => {
  const token = localStorage.getItem('adminToken');
  const res = await API.get('/auth/admin/verify', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const changeAdminPassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem('adminToken');
  const res = await API.post('/auth/admin/change-password', 
    { currentPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};