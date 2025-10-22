// src/api/paymentService.js
import apiClient from "./apiClient";

// GET all payments
export const getAllPayments = async () => {
  const res = await apiClient.get("/api/Payment");
  return res.data;
};

// GET payment by ID
export const getPaymentById = async (id) => {
  const res = await apiClient.get(`/api/Payment/${id}`);
  return res.data;
};

// CREATE new payment
export const createPayment = async (payment) => {
  const res = await apiClient.post("/api/Payment", payment);
  return res.data;
};

// UPDATE payment
export const updatePayment = async (id, payment) => {
  const res = await apiClient.put(`/api/Payment/${id}`, payment);
  return res.data;
};

// DELETE payment
export const deletePayment = async (id) => {
  await apiClient.delete(`/api/Payment/${id}`);
};
