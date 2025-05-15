<template>
  <div class="game-form">
    <h2>Add New Game</h2>
    <div v-if="message" :class="['alert', messageType === 'error' ? 'alert-error' : 'alert-success']">
      {{ message }}
    </div>
    
    <form @submit.prevent="submitGame" enctype="multipart/form-data">
      <div class="form-group">
        <label for="title">Game Title*</label>
        <input 
          id="title" 
          v-model="game.title" 
          required 
          class="form-control"
          placeholder="Enter game title"
        />
      </div>
      
      <div class="form-group">
        <label for="platform">Platform*</label>
        <input 
          id="platform" 
          v-model="game.platform" 
          required 
          class="form-control"
          placeholder="Platform (e.g., PS5, Xbox, PC)"
        />
      </div>
      
      <div class="form-group">
        <label for="release-date">Release Date</label>
        <input 
          id="release-date" 
          type="date" 
          v-model="game.release_date" 
          class="form-control"
        />
      </div>
      
      <div class="form-group">
        <label for="publisher">Publisher</label>
        <input 
          id="publisher" 
          v-model="game.publisher" 
          class="form-control"
          placeholder="Publisher name"
        />
      </div>
      
      <div class="form-group">
        <label for="genre">Genre*</label>
        <select 
          id="genre" 
          v-model="game.genre" 
          required
          class="form-control"
        >
          <option value="" disabled>Select genre</option>
          <option v-for="genre in genres" :key="genre.genre_id" :value="genre.genre_id">
            {{ genre.genre_name }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="maturity-rating">Maturity Rating</label>
        <select 
          id="maturity-rating" 
          v-model="game.maturity_rating" 
          class="form-control"
        >
          <option value="" disabled>Select rating</option>
          <option value="E">E (Everyone)</option>
          <option value="E10+">E10+ (Everyone 10+)</option>
          <option value="T">T (Teen)</option>
          <option value="M">M (Mature)</option>
          <option value="AO">AO (Adults Only)</option>
          <option value="RP">RP (Rating Pending)</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="description">Description</label>
        <textarea 
          id="description" 
          v-model="game.description" 
          class="form-control"
          placeholder="Game description"
          rows="5"
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="image">Game Image</label>
        <input 
          id="image" 
          type="file" 
          @change="handleImageUpload" 
          class="form-control"
          accept="image/*"
        />
      </div>
      
      <button type="submit" :disabled="isSubmitting" class="submit-btn">
        {{ isSubmitting ? 'Submitting...' : 'Add Game' }}
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'GameForm',
  data() {
    return {
      game: {
        title: '',
        platform: '',
        release_date: '',
        publisher: '',
        description: '',
        genre: '',
        maturity_rating: '',
        imageFile: null
      },
      genres: [],
      isSubmitting: false,
      message: '',
      messageType: ''
    };
  },
  created() {
    this.fetchGenres();
  },
  methods: {
    async fetchGenres() {
      try {
        const response = await axios.get('https://isqa4900.pythonanywhere.com/api/genres/');
        this.genres = response.data;
      } catch (error) {
        console.error('Error fetching genres:', error);
        this.message = 'Failed to load genres. Please refresh the page.';
        this.messageType = 'error';
      }
    },
    handleImageUpload(event) {
      this.game.imageFile = event.target.files[0];
    },
    async submitGame() {
      if (!localStorage.getItem('accessToken')) {
        this.$router.push('/login');
        return;
      }
      
      this.isSubmitting = true;
      this.message = '';
      
      try {
        console.log('Form data:', this.game);
        console.log('Selected file:', this.game.imageFile);

        const formDataToSend = new FormData();
        formDataToSend.append('title', this.game.title);
        formDataToSend.append('platform', this.game.platform);
        formDataToSend.append('release_date', this.game.release_date);
        formDataToSend.append('publisher', this.game.publisher);
        formDataToSend.append('description', this.game.description);
        formDataToSend.append('genre', this.game.genre);
        formDataToSend.append('maturity_rating', this.game.maturity_rating);
        if (this.game.imageFile) {
          formDataToSend.append('image', this.game.imageFile);
        }

        const response = await axios.post(
          'https://isqa4900.pythonanywhere.com/games/create/',
          formDataToSend,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        );

        this.game = {
          title: '',
          platform: '',
          release_date: '',
          publisher: '',
          description: '',
          genre: '',
          maturity_rating: '',
          imageFile: null
        };
        this.message = 'Game added successfully!';
        this.messageType = 'success';
        
        // Emit an event so parent components can react
        this.$emit('game-added', response.data);
      } catch (error) {
        console.error('Error adding game:', error);
        this.message = 'Error adding game. Please try again.';
        
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
.game-form {
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
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