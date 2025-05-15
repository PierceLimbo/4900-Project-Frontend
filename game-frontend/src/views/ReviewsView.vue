<template>
  <div class="reviews-container">
    <h1>My Reviews</h1>
    
    <div class="reviews-list" v-if="reviews.length > 0">
      <div v-for="review in reviews" :key="review.review_id" class="review-card">
        <!-- Show edit form if this review is being edited -->
        <EditReviewForm 
          v-if="editingReviewId === review.review_id" 
          :review="review" 
          @review-updated="handleReviewUpdated" 
          @cancel="cancelEdit"
        />
        
        <!-- Show regular review if not editing -->
        <div v-else>
          <div class="review-header">
            <div class="game-info">
              <h3>{{ review.game_title }}</h3>
              <div class="review-date">
                Reviewed on {{ formatDate(review.created_at) }}
              </div>
            </div>
            <div class="review-actions">
              <div class="review-rating">
                Rating: <span class="rating-value">{{ review.rating }}/5</span>
              </div>
              <div class="action-buttons">
                <button @click="startEdit(review)" class="edit-btn">Edit</button>
                <button 
                  @click="deleteReview(review.review_id)" 
                  class="delete-btn"
                  :disabled="isDeletingReview === review.review_id"
                >
                  {{ isDeletingReview === review.review_id ? 'Deleting...' : 'Delete' }}
                </button>
              </div>
            </div>
          </div>
          <div class="review-body">
            <p>{{ review.review_text }}</p>
          </div>
          <div class="review-footer">
            <router-link :to="`/games/${review.game}`" class="view-game-btn">
              View Game
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="loading">
      <p>Loading your reviews...</p>
    </div>
    
    <div v-else class="no-reviews">
      <p>You haven't written any reviews yet.</p>
      <router-link to="/browse" class="browse-btn">Browse Games</router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EditReviewForm from '@/components/EditReviewForm.vue';

export default {
  name: 'ReviewsView',
  components: {
    EditReviewForm
  },
  data() {
    return {
      reviews: [],
      loading: true,
      currentUser: null,
      isDeletingReview: null,
      editingReviewId: null,
      gameId: this.$route.params.game_id || null  // Optional game_id from route
    };
  },
  created() {
    this.fetchCurrentUser().then(() => {
      this.fetchUserReviews();
    });
  },
  methods: {
    async fetchCurrentUser() {
      try {
        const response = await axios.get('http://localhost:8000/api/user/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        this.currentUser = response.data;
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        if (error.response && error.response.status === 401) {
          // Token expired or invalid
          this.$router.push('/login');
        }
        return null;
      }
    },
    async fetchUserReviews() {
      if (!this.currentUser) return;
      
      try {
        // Build the URL with optional game filter
        let url = `http://localhost:8000/reviews/?user=${this.currentUser.id}`;
        if (this.gameId) {
          url += `&game=${this.gameId}`;
        }
        
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        this.reviews = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.loading = false;
      }
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    async deleteReview(reviewId) {
      if (!confirm('Are you sure you want to delete this review?')) {
        return;
      }
      
      this.isDeletingReview = reviewId;
      
      try {
        await axios.delete(`http://localhost:8000/reviews/${reviewId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        
        // Remove the deleted review from the list
        this.reviews = this.reviews.filter(review => review.review_id !== reviewId);
        
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete review. Please try again.');
      } finally {
        this.isDeletingReview = null;
      }
    },
    startEdit(review) {
      this.editingReviewId = review.review_id;
    },
    cancelEdit() {
      this.editingReviewId = null;
    },
    handleReviewUpdated(updatedReview) {
      // Update the review in the list
      const index = this.reviews.findIndex(r => r.review_id === updatedReview.review_id);
      if (index !== -1) {
        // Keep the game_title from our original review since the API response might not include it
        updatedReview.game_title = this.reviews[index].game_title;
        this.reviews.splice(index, 1, updatedReview);
      }
      
      // Exit edit mode
      this.editingReviewId = null;
    }
  }
};
</script>

<style scoped>
.reviews-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.game-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.review-date {
  font-size: 0.85rem;
  color: #888;
}

.review-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.rating-value {
  font-weight: 600;
  color: #ff4d4f;
}

.review-body {
  margin-bottom: 20px;
}

.review-body p {
  line-height: 1.5;
  color: #333;
  margin: 0;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
}

.view-game-btn {
  display: inline-block;
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.view-game-btn:hover {
  background-color: #40a9ff;
}

.no-reviews {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.browse-btn {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
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

.loading {
  text-align: center;
  padding: 40px 0;
  color: #666;
}

.edit-btn, .delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.edit-btn {
  background-color: #1890ff;
  color: white;
  border: none;
}

.edit-btn:hover {
  background-color: #40a9ff;
}

.delete-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
}

.delete-btn:hover {
  background-color: #ff7875;
}

.delete-btn:disabled {
  background-color: #ffcccb;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .review-header {
    flex-direction: column;
    gap: 15px;
  }
  
  .review-actions {
    align-items: flex-start;
  }
}
</style>