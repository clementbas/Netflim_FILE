import axios from 'axios';

export const dataService = axios.create({
  baseURL: process.env.DATA_SERVICE_URL || 'http://localhost:4002',
  headers: {
    'Content-Type': 'application/json'
  }
});
