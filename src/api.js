import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://bulk-email-tool-backend-ulpd.onrender.com'
});

export default instance;