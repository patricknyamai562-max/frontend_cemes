// src/api/loanService.js
import apiClient from "./apiClient";

// GET all loans
export const getAllLoans = async () => {
  const res = await apiClient.get("/api/Loan");
  return res.data;
};

// GET loan by ID
export const getLoanById = async (id) => {
  const res = await apiClient.get(`/api/Loan/${id}`);
  return res.data;
};

// CREATE new loan
export const createLoan = async (loan) => {
  const res = await apiClient.post("/api/Loan", loan);
  return res.data;
};

// UPDATE loan
export const updateLoan = async (id, loan) => {
  const res = await apiClient.put(`/api/Loan/${id}`, loan);
  return res.data;
};

// DELETE loan
export const deleteLoan = async (id) => {
  await apiClient.delete(`/api/Loan/${id}`);
};
