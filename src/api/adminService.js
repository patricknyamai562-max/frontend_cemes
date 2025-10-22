// src/api/adminService.js
import apiClient from "./apiClient";

// GET all admins
export const getAllAdmins = async () => {
  const res = await apiClient.get("/api/Admin");
  return res.data;
};

// GET admin by ID
export const getAdminById = async (id) => {
  const res = await apiClient.get(`/api/Admin/${id}`);
  return res.data;
};

// CREATE new admin
export const createAdmin = async (admin) => {
  const res = await apiClient.post("/api/Admin", admin);
  return res.data;
};

// UPDATE admin
export const updateAdmin = async (id, admin) => {
  const res = await apiClient.put(`/api/Admin/${id}`, admin);
  return res.data;
};

// DELETE admin
export const deleteAdmin = async (id) => {
  await apiClient.delete(`/api/Admin/${id}`);
};
