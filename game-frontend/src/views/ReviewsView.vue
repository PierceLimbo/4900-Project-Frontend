<template>
  <div class="reviews-page">
    <!-- Add Review Form - Only show when viewing a specific game -->
    <div v-if="gameId" class="add-review-section">
      <h2>Write a Review</h2>
      <form @submit.prevent="handleAddReview" class="review-form">
        <div class="form-group">
          <label>Rating:</label>
          <div class="rating-input">
            <span 
              v-for="n in 5" 
              :key="n"
              @click="newReview.rating = n"
              :class="['star', { 'filled': n <= newReview.rating }]"
            >
              ★
            </span>
          </div>
        </div>
        <div class="form-group">
          <textarea 
            v-model="newReview.review_text" 
            placeholder="Write your review here..."
            required
            class="review-textarea"
            rows="4"
          ></textarea>
        </div>
        <button type="submit" class="submit-btn" :disabled="isSubmittingReview">
          {{ isSubmittingReview ? 'Submitting Review...' : 'Submit Review' }}
        </button>
      </form>
    </div>

    <!-- Reviews Section -->
    <div class="reviews-section">
      <h1 class="page-title">{{ gameId ? 'Game Reviews' : 'My Reviews' }}</h1>

      <div v-if="loading" class="loading">
        Loading reviews...
      </div>

      <div v-else-if="error" class="error">
        {{ error }}
      </div>

      <div v-else>
        <div v-if="reviews.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-comments"></i>
          </div>
          <h2>No Reviews Yet</h2>
          <p v-if="gameId">
            Be the first to review this game!
          </p>
          <p v-else>
            You haven't written any reviews yet. Start sharing your thoughts about the games you've played!
          </p>
          <router-link v-if="!gameId" to="/browse" class="browse-btn">
            Browse Games
          </router-link>
        </div>

        <div v-else v-for="review in reviews" :key="review.id" class="review-card">
          <div class="review-header">
            <h3 class="reviewer">
              {{ gameId ? `Review by ${review.user}` : `Review for ${review.game_title}` }}
            </h3>
            <div class="review-rating">
              <span>Rating: </span>
              <span class="rating-stars">
                {{ getStarRating(review.rating) }}
              </span>
            </div>
          </div>

          <p class="review-text">"{{ review.review_text }}"</p>
          <p class="review-date">Posted: {{ new Date(review.created_at).toLocaleDateString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "GameReviews",
  data() {
    return {
      reviews: [],
      loading: true,
      error: null,
      isSubmittingReview: false,
      newReview: {
        rating: 5,
        comment: ''
      }
    };
  },
  computed: {
    gameId() {
      return this.$route.params.game_id;
    }
  },
  methods: {
    getStarRating(rating) {
      let filledStars = '★'.repeat(rating); 
      let emptyStars = '☆'.repeat(5 - rating); 
      return filledStars + emptyStars; 
    },
    async fetchReviews() {
      this.loading = true;
      this.error = null;
      
      try {
        let url = 'http://localhost:8000/api/reviews/';
        if (this.gameId) {
          url = `http://localhost:8000/api/games/${this.gameId}/reviews/`;
        }
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        this.reviews = response.data;
      } catch (error) {
        this.error = "Failed to load reviews. Please try again later.";
        console.error("Error fetching reviews:", error);
      } finally {
        this.loading = false;
      }
    },
    async handleAddReview() {
      if (!this.newReview.rating || !this.newReview.review_text) {
        alert('Please provide both a rating and review text');
        return;
      }

      this.isSubmittingReview = true;
      try {
        const response = await axios.post(
          `http://localhost:8000/api/games/${this.gameId}/reviews/`,
          this.newReview,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        this.newReview = {
          rating: 5,
          comment: ''
        };

        await this.fetchReviews();
        alert('Review added successfully!');
      } catch (error) {
        console.error('Error adding review:', error);
        alert('Failed to add review. Please try again.');
      } finally {
        this.isSubmittingReview = false;
      }
    }
  },
  mounted() {
    this.fetchReviews();
  },
  watch: {
    gameId() {
      this.fetchReviews();
    }
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

.add-review-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.add-review-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-weight: 500;
  color: #333;
}

.review-textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.2s;
}

.review-textarea:focus {
  border-color: #ff4d4f;
  outline: none;
}

.review-textarea {
  resize: vertical;
  min-height: 100px;
}

.rating-input {
  display: flex;
  gap: 5px;
  font-size: 1.5em;
}

.star {
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s;
}

.star.filled {
  color: #f5b301;
}

.star:hover {
  color: #f5b301;
}

.submit-btn {
  background-color: #ff4d4f;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 4px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #ff7875;
}

.submit-btn:disabled {
  background-color: #ffb3b3;
  cursor: not-allowed;
}

.reviews-section {
  margin-top: 40px;
}

.review-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.reviewer {
  margin: 0;
  color: #333;
}

.review-rating {
  color: #f5b301;
}

.review-text {
  font-size: 1.1em;
  line-height: 1.5;
  margin: 15px 0;
  color: #444;
}

.review-date {
  color: #666;
  font-size: 0.9em;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.empty-state-icon {
  font-size: 4em;
  color: #ddd;
  margin-bottom: 20px;
}

.empty-state h2 {
  font-size: 1.5em;
  color: #333;
  margin-bottom: 10px;
}

.empty-state p {
  color: #666;
  margin-bottom: 20px;
  font-size: 1.1em;
}

.browse-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #ff4d4f;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.browse-btn:hover {
  background-color: #ff7875;
}
</style>
