import axios from 'axios';

// Base URL for all API requests
const BASE_URL = 'https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api';


const api = {
  // CUSTOMER OPERATIONS
  getCustomers: async () => {
    const response = await axios.get(`${BASE_URL}/customers`);
    return response.data._embedded.customers;
  },

  addCustomer: async (customer) => {
    const response = await axios.post(`${BASE_URL}/customers`, customer);
    return response.data;
  },

  updateCustomer: async (customerUrl, customer) => {
    const response = await axios.put(customerUrl, customer);
    return response.data;
  },

  deleteCustomer: async (customerUrl) => {
    await axios.delete(customerUrl);
  },

  getTrainings: async () => {
    const response = await axios.get(`${BASE_URL}/gettrainings`);
    return response.data;
  },

  addTraining: async (training) => {
    const response = await axios.post(`${BASE_URL}/trainings`, training);
    return response.data;
  },

  deleteTraining: async (trainingId) => {
    await axios.delete(`${BASE_URL}/trainings/${trainingId}`);
  },
};

export default api;


