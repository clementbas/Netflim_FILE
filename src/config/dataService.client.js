import axios from 'axios';
import { env } from './env.js';

export const dataService = axios.create({
  baseURL: env.dataServiceUrl,
  headers: {
    'Content-Type': 'application/json',
    'x-service-token': env.serviceToken
  }
});
