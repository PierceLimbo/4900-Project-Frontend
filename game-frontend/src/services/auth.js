import axios from 'axios';

const API_URL = 'https://plimbo.pythonanywhere.com/';

const auth = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default auth;

export const postGame = (gameData) => auth.post('api/games/', gameData);
export const deleteGame = (id) => auth.delete(`api/games/${id}/`);

export const postReview = (reviewData) => auth.post('api/reviews/', reviewData);
export const deleteReview = (id) => auth.delete(`api/reviews/${id}/`);