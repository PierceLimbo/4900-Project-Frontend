<template>
  <div class="game-details">
    <div v-if="loading" class="loading">
      Loading game details...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="game-content">
      <div class="game-header">
        <img :src="game.image" :alt="game.title" class="game-image" />
        <div class="game-info">
          <h1>{{ game.title }}</h1>
          <p class="publisher"><b>By:</b> {{ game.publisher }}</p>
          <p class="release-date"><b>Release Date:</b> {{ game.release_date }}</p>
          <p class="platform"><b>Platform:</b> {{ game.platform }}</p>
          <p class="genre"><b>Genre:</b> {{ game.genre }}</p>
          <div class="rating">
            <span v-for="n in 10" :key="n">
              <i :class="n <= Math.round(game.average_rating) ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
            <span class="numeric-rating">({{ game.average_rating.toFixed(1) }}/10)</span>
          </div>
          <router-link :to="'/reviews/' + game.id" class="view-reviews-btn">View Reviews</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: 'GameDetailView',
  data() {
    return {
      game: null,
      loading: true,
      error: null
    };
  },
  methods: {
    async fetchGameDetails() {
      this.loading = true;
      this.error = null;
      
      const gameId = this.$route.params.game_id;
      if (!gameId || gameId === 'undefined') {
        this.error = "Invalid game ID. Please select a valid game.";
        this.loading = false;
        return;
      }
      
      try {
        const response = await axios.get(`http://localhost:8000/api/games/${gameId}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        console.log("Game details response:", response.data);
        this.game = response.data;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          this.error = "Game not found. Please check the URL and try again.";
        } else {
          this.error = "Failed to load game details. Please try again later.";
        }
        console.error("Error fetching game details:", error);
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchGameDetails();
  },
  watch: {
    '$route.params.game_id'() {
      this.fetchGameDetails();
    }
  }
};
</script>

<style scoped>
.game-details {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  color: #dc3545;
}

.game-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.game-header {
  display: flex;
  gap: 30px;
}

.game-image {
  width: 400px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.game-info {
  flex: 1;
}

.game-info h1 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #333;
}

.publisher, .release-date, .platform, .genre {
  margin: 10px 0;
  color: #666;
}

.rating {
  font-size: 1.2em;
  color: #f5b301;
  margin: 20px 0;
}

.numeric-rating {
  font-size: 0.9em;
  margin-left: 5px;
  color: #333;
}

.view-reviews-btn {
  display: inline-block;
  padding: 12px 24px;
  background-color: #ff4d4f;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.view-reviews-btn:hover {
  background-color: #ff7875;
}
</style>
  