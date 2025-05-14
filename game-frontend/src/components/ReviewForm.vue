<template>
  <div class="review-form">
    <h2>Submit Your Review</h2>
    <div v-if="message" :class="['alert', messageType === 'error' ? 'alert-error' : 'alert-success']">
      {{ message }}
    </div>
    
    <form @submit.prevent="submitReview">
      <div class="form-group">
        <label for="rating">Rating (1-5)</label>
        <select id="rating" v-model="review.rating" required class="form-control">
          <option value="" disabled>Select rating</option>
          <option v-for="n in 5" :key="n" :value="n">{{ n }} {{ n === 1 ? 'Star' : 'Stars' }}</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="review-text">Your Review</label>
        <textarea 
          id="review-text" 
          v-model="review.review_text" 
          required 
          class="form-control"
          placeholder="Write your review here..."
          rows="5"
        ></textarea>
      </div>
      
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ReviewForm',
  props: {
    gameId: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      review: {
        game: this.gameId,
        rating: '',
        review_text: ''
      },
      isSubmitting: false,
      message: '',
      messageType: ''
    };
  },
  methods: {
    async submitReview() {
      if (!localStorage.getItem('accessToken')) {
        this.$router.push('/login');
        return;
      }
      
      this.isSubmitting = true;
      this.message = '';
      
      try {
        console.log('Submitting review for game:', this.gameId);
        
        const response = await axios.post(
          'http://localhost:8000/reviews/create/',
          {
            game: this.gameId,
            rating: this.review.rating,
            review_text: this.review.review_text
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );
        
        console.log('Review submitted successfully:', response.data);
        this.message = 'Review submitted successfully!';
        this.messageType = 'success';
        this.review.rating = '';
        this.review.review_text = '';
        
        // Emit an event so parent components can react to the new review
        this.$emit('review-submitted', response.data);
      } catch (error) {
        console.error('Error submitting review:', error);
        this.message = 'Error submitting review. Please try again.';
        
        if (error.response) {
          console.log('Error response:', error.response.data);
          if (typeof error.response.data === 'object') {
            this.message += ' Details: ' + JSON.stringify(error.response.data);
          }
        }
        
        this.messageType = 'error';
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.review-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
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

.submit-btn {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  font-size: 16px;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #ff7875;
}

.submit-btn:disabled {
  background-color: #ffcccb;
  cursor: not-allowed;
}

.alert {
  padding: 10px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
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
