<template>
  <div class="game-detail-container" v-if="game">
    <div class="game-header">
      <img v-if="game.image" :src="game.image" :alt="game.title" class="game-image" />
      <div v-else class="placeholder-image">No image available</div>
      
      <div class="game-info">
        <h1>{{ game.title }}</h1>
        <div class="meta-info">
          <div class="info-item">
            <span class="label">Platform:</span> {{ game.platform }}
          </div>
          <div class="info-item" v-if="game.release_date">
            <span class="label">Release Date:</span> {{ formatDate(game.release_date) }}
          </div>
          <div class="info-item" v-if="game.publisher">
            <span class="label">Publisher:</span> {{ game.publisher }}
          </div>
          <div class="info-item" v-if="game.genre_name">
            <span class="label">Genre:</span> {{ game.genre_name }}
          </div>
          <div class="info-item" v-if="game.maturity_rating">
            <span class="label">Rating:</span> {{ game.maturity_rating }}
          </div>
          <div class="info-item rating">
            <span class="label">User Score:</span> 
            <span class="score">{{ game.average_rating }}/5</span>
          </div>
        </div>
        
        <div class="description" v-if="game.description">
          <h2>Description</h2>
          <p>{{ game.description }}</p>
        </div>
      </div>
    </div>
    
    <div class="reviews-section">
      <h2>Reviews</h2>
      <div v-if="isAuthenticated" class="add-review">
        <ReviewForm :gameId="gameId" @review-submitted="handleNewReview" />
      </div>
      <div v-else class="login-prompt">
        <p>Please <router-link to="/login">login</router-link> to submit a review.</p>
      </div>
      
      <div class="reviews-list" v-if="reviews.length > 0">
        <div v-for="review in reviews" :key="review.review_id" class="review-card">
          <div class="review-header">
            <div class="user-info">
              <strong>{{ review.username }}</strong>
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
            </div>
            <div class="review-actions">
              <div class="review-rating">
                Rating: <span class="rating-value">{{ review.rating }}/5</span>
              </div>
              <button 
                v-if="canDeleteReview(review)" 
                @click="deleteReview(review.review_id)" 
                class="delete-btn"
                :disabled="isDeletingReview === review.review_id"
              >
                {{ isDeletingReview === review.review_id ? 'Deleting...' : 'Delete' }}
              </button>
            </div>
          </div>
          <div class="review-body">
            <p>{{ review.review_text }}</p>
          </div>
        </div>
      </div>
      <div v-else class="no-reviews">
        <p>No reviews yet. Be the first to review this game!</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading game details...</p>
  </div>
</template>

<script>
import axios from 'axios';
import ReviewForm from '@/components/ReviewForm.vue';

export default {
  name: 'GameDetailView',
  components: {
    ReviewForm
  },
  data() {
    return {
      gameId: this.$route.params.game_id,
      game: null,
      reviews: [],
      currentUser: null,
      isDeletingReview: null
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('accessToken');
    }
  },
  created() {
    this.fetchGameDetails();
    this.fetchGameReviews();
    if (this.isAuthenticated) {
      this.fetchCurrentUser();
    }
  },
  methods: {
    async fetchGameDetails() {
      try {
        const response = await axios.get(`https://isqa4900.pythonanywhere.com/games/${this.gameId}/`);
        this.game = response.data;
      } catch (error) {
        console.error('Error fetching game details:', error);
      }
    },
    async fetchGameReviews() {
      try {
        const response = await axios.get(`https://isqa4900.pythonanywhere.com/reviews/?game=${this.gameId}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    async fetchCurrentUser() {
      try {
        const response = await axios.get('https://isqa4900.pythonanywhere.com/api/user/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        this.currentUser = response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    handleNewReview(review) {
      this.reviews.unshift(review);
      this.fetchGameDetails();
    },
    canDeleteReview(review) {
      return this.currentUser && review.user === this.currentUser.id;
    },
    async deleteReview(reviewId) {
      if (!confirm('Are you sure you want to delete this review?')) {
        return;
      }
      
      this.isDeletingReview = reviewId;
      
      try {
        await axios.delete(`https://isqa4900.pythonanywhere.com/reviews/${reviewId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        this.reviews = this.reviews.filter(review => review.review_id !== reviewId);
        
        this.fetchGameDetails();
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      } finally {
        this.isDeletingReview = null;
      }
    }
  }
};
</script>

<style scoped>
.game-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.game-header {
  display: flex;
  gap: 40px;
  margin-bottom: 50px;
  padding: 20px;
  background-color: #fafafa;
  border-radius: 12px;
}

.game-image {
  width: 350px;
  height: 450px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease;
}

.game-image:hover {
  transform: scale(1.02);
}

.placeholder-image {
  width: 350px;
  height: 450px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 12px;
  font-weight: 500;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.game-info {
  flex: 1;
  padding: 20px 0;
}

h1 {
  margin-top: 0;
  margin-bottom: 25px;
  color: #1a1a1a;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 1.2;
}

.meta-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.info-item {
  font-size: 1.1rem;
  padding: 10px;
  border-radius: 6px;
  background-color: #f8f8f8;
}

.label {
  font-weight: 600;
  color: #666;
  margin-right: 8px;
}

.rating .score {
  font-weight: 700;
  font-size: 1.3rem;
  color: #ff4d4f;
}

.description {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.description h2 {
  margin-bottom: 15px;
  font-size: 1.6rem;
  color: #1a1a1a;
  font-weight: 600;
}

.description p {
  line-height: 1.8;
  color: #444;
  font-size: 1.1rem;
}

.reviews-section {
  margin-top: 50px;
  padding: 30px;
  background-color: #fafafa;
  border-radius: 12px;
}

.reviews-section h2 {
  margin-bottom: 25px;
  font-size: 2rem;
  color: #1a1a1a;
  font-weight: 700;
}

.login-prompt {
  padding: 25px;
  background-color: white;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 35px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.login-prompt a {
  color: #ff4d4f;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.login-prompt a:hover {
  color: #ff7875;
}

.reviews-list {
  margin-top: 35px;
}

.review-card {
  background-color: white;
  border-radius: 10px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info strong {
  font-size: 1.1rem;
  color: #1a1a1a;
}

.review-date {
  font-size: 0.9rem;
  color: #888;
  margin-top: 4px;
}

.rating-value {
  font-weight: 600;
  color: #ff4d4f;
  font-size: 1.1rem;
}

.review-body p {
  line-height: 1.7;
  color: #333;
  font-size: 1.05rem;
}

.no-reviews {
  text-align: center;
  padding: 50px 0;
  color: #666;
  font-style: italic;
  font-size: 1.1rem;
}

.add-review {
  margin-bottom: 45px;
}

.loading {
  text-align: center;
  padding: 120px 0;
  font-size: 1.3rem;
  color: #666;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 15px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  background-color: #ff7875;
  transform: translateY(-1px);
}

.delete-btn:disabled {
  background-color: #ffcccb;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .game-detail-container {
    padding: 15px;
  }

  .game-header {
    flex-direction: column;
    gap: 25px;
    padding: 15px;
  }
  
  .game-image, .placeholder-image {
    width: 100%;
    height: auto;
    aspect-ratio: 3/4;
    margin-bottom: 20px;
  }
  
  h1 {
    font-size: 2.2rem;
  }
  
  .meta-info {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
  
  .review-header {
    flex-direction: column;
    gap: 12px;
  }
  
  .review-actions {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
