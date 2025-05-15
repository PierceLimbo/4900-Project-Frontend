<template>
  <div class="edit-review-form">
    <h3>Edit Your Review</h3>
    <div v-if="message" :class="['alert', messageType === 'error' ? 'alert-error' : 'alert-success']">
      {{ message }}
    </div>
    
    <form @submit.prevent="submitEdit">
      <div class="form-group">
        <label for="edit-rating">Rating (1-5)</label>
        <select id="edit-rating" v-model="editedReview.rating" required class="form-control">
          <option value="" disabled>Select rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Star' : 'Stars' }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="edit-review-text">Your Review</label>
        <textarea 
          id="edit-review-text" 
          v-model="editedReview.review_text" 
          required 
          class="form-control"
          placeholder="Write your review here..."
          rows="5"
        ></textarea>
      </div>
      
      <div class="button-group">
        <button type="button" @click="$emit('cancel')" class="cancel-btn">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting" class="submit-btn">
          {{ isSubmitting ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'EditReviewForm',
  props: {
    review: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      editedReview: {
        rating: this.review.rating,
        review_text: this.review.review_text
      },
      isSubmitting: false,
      message: '',
      messageType: ''
    };
  },
  methods: {
    async submitEdit() {
      if (!localStorage.getItem('accessToken')) {
        this.$router.push('/login');
        return;
      }
      
      this.isSubmitting = true;
      this.message = '';
      
      try {
        const response = await axios.put(
          `https://isqa4900.pythonanywhere.com/reviews/${this.review.review_id}/update/`,
          {
            rating: this.editedReview.rating,
            review_text: this.editedReview.review_text,
            game: this.review.game
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        this.message = 'Review updated successfully!';
        this.messageType = 'success';
        
        this.$emit('review-updated', {
          ...response.data,
          game_title: this.review.game_title
        });
        
        setTimeout(() => {
          this.$emit('cancel');
        }, 1500);
      } catch (error) {
        console.error('Error updating review:', error);
        this.message = 'Error updating review. Please try again.';
        this.messageType = 'error';
        
        if (error.response && error.response.data) {
          if (typeof error.response.data === 'object') {
            this.message = JSON.stringify(error.response.data);
          } else if (error.response.data.message) {
            this.message = error.response.data.message;
          }
        }
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.edit-review-form {
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

.form-control {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-control:focus {
  border-color: #ff4d4f;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.button-group {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.submit-btn, .cancel-btn {
  padding: 10px 15px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.2s;
}

.submit-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
}

.submit-btn:hover {
  background-color: #ff7875;
}

.submit-btn:disabled {
  background-color: #ffcccb;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}

.alert {
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.alert-success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.alert-error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}
</style> 