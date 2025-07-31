import axios from 'axios';
import { environment } from './environment'

const attachAuthToken = (config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

const createClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  client.interceptors.request.use(attachAuthToken, (error) => Promise.reject(error));
  return client;
};

// Create API clients
const authClient = createClient(`${environment.userEndpoint}/api`);
const masterClient = createClient(`${environment.mastersEndPoint}/api/`);
const projectClient = createClient(`${environment.servicesEndPoint}/api/project/`);
const websiteClient = createClient(`${environment.websiteEndPoint}/api/v1/`);
export { authClient, masterClient, projectClient, websiteClient };