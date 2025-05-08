<template>
  <div class="reviews-page">
    <h1 class="page-title">My Game Reviews</h1>

    <!-- Review form -->
    <form @submit.prevent="addReview">
      <select v-model="newReview.game" required>
        <option v-for="game in games" :value="game.id" :key="game.id">{{ game.title }}</option>
      </select>
      <textarea v-model="newReview.review_text" placeholder="Your review" required></textarea>
      <input v-model="newReview.rating" type="number" min="1" max="10" required />
      <button type="submit">Submit Review</button>
    </form>

    <!-- User's reviews list -->
    <div v-for="review in reviews" :key="review.id" class="review-card">
      <button @click="deleteReview(review.id)">Delete</button>
      <div class="review-header">
        <h3 class="game-title">{{ review.game_title }}</h3>
        <div class="review-rating">
          <span>Rating: </span>
          <span class="rating-stars">{{ getStarRating(review.rating) }}</span>
        </div>
      </div>
      <p class="review-text">"{{ review.review_text }}"</p>
      <p class="review-user">Posted: {{ formatDate(review.created_at) }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { postReview, deleteReview } from '@/services/auth';

const API_URL = 'https://plimbo.pythonanywhere.com/';

export default {
  name: "MyReviewsView",
  data() {
    return {
      reviews: [],
      games: [],
      newReview: {
        game: '',
        review_text: '',
        rating: 5
      }
    };
  },
  methods: {
    async fetchReviews() {
      const response = await axios.get(API_URL + 'api/reviews/my-reviews/');
      this.reviews = response.data;
    },
    async fetchGames() {
      const response = await axios.get(API_URL + 'api/games/');
      this.games = response.data;
    },
    async addReview() {
      await postReview(this.newReview);
      this.newReview = { game: '', review_text: '', rating: 5 };
      this.fetchReviews();
    },
    async deleteReview(id) {
      await deleteReview(id);
      this.fetchReviews();
    },
    getStarRating(rating) {
      const rounded = Math.round(rating);
      return '★'.repeat(rounded) + '☆'.repeat(10 - rounded);
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    }
  },
  mounted() {
    this.fetchReviews();
    this.fetchGames();
  }
};
</script>

<style scoped>
.reviews-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.review-card {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-title {
  font-size: 1.5em;
  font-weight: bold;
}

.review-rating {
  font-size: 1.2em;
}

.rating-stars {
  color: #ffbf00; /* Yellow for stars */
}

.review-text {
  font-size: 1em;
  margin-top: 10px;
  font-style: italic;
}

.review-user {
  margin-top: 10px;
  font-weight: 600;
}
</style>
