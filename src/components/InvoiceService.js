// src/components/InvoiceService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/invoice';

export const saveInvoice = (data) => {
  return axios.post(API_URL, data);
};

export const getInvoices = () => {
  return axios.get(API_URL);
};

export const searchInvoices = (keyword) => {
  return axios.get(`${API_URL}/search?keyword=${keyword}`);
};

export const updateInvoice = (id, data) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteInvoice = (id) => {
  return axios.delete(`${API_URL}/${id}`);
};
