// src/api/customerService.js
import apiClient from "./apiClient";

// GET all customers
export const getAllCustomers = async () => {
  const res = await apiClient.get("/api/Customer");
  return res.data;
};

// GET customer by ID
export const getCustomerById = async (id) => {
  const res = await apiClient.get(`/api/Customer/${id}`);
  return res.data;
};

// CREATE new customer
export const createCustomer = async (customer) => {
  const res = await apiClient.post("/api/Customer", customer);
  return res.data;
};

// UPDATE customer
export const updateCustomer = async (id, customer) => {
  const res = await apiClient.put(`/api/Customer/${id}`, customer);
  return res.data;
};

// DELETE customer
export const deleteCustomer = async (id) => {
  await apiClient.delete(`/api/Customer/${id}`);
};
