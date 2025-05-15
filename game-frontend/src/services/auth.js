import axios from 'axios';

const API_URL = 'https://isqa4900.pythonanywhere.com';

const auth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default auth;