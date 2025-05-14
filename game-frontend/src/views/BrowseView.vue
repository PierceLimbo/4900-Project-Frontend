<template>
  <div class="home-view">
    <div class="header-section">
      <div class="title-section">
        <h1 class="title">GameCritiq Library</h1>
        <p class="subtitle">Explore our entire collection of games rated by the community.</p>
      </div>
      <button 
        v-if="isAuthenticated" 
        class="add-game-btn"
        @click="handleAddGame"
      >
        <i class="fas fa-plus"></i> Add Game
      </button>
    </div>

    <div class="games">
      <div v-for="game in games" :key="game.game_id" class="game-card">
        <img :src="game.image" :alt="game.title" class="game-image" />
        <div class="info">
          <h2>{{ game.title }}</h2>
          <p class="publisher"><b>By:</b> {{ game.publisher }}  <br><b>Release Date</b>: {{ game.release_date }}</p>
          <p class="details"><b>Where You Can Play</b>: {{ game.platform }} 
          <br> <b>Genre</b>: {{ game.genre}}</p>
          <div class="rating">
            <span v-for="n in 5" :key="n">
              <i :class="n <= Math.round(game.average_rating) ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
            <span class="numeric-rating">({{ game.average_rating.toFixed(1) }}/5)</span>
          </div>
          <div class="button-group">
            <router-link :to="'/games/' + game.game_id" class="view-btn">View Details</router-link>
            <button 
              v-if="isAuthenticated" 
              @click="viewReviews(game.game_id)" 
              class="reviews-btn"
            >
              View Reviews
            </button>
            <router-link 
              v-else 
              to="/login" 
              class="reviews-btn"
            >
              Sign in to View Reviews
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: 'BrowseView',
  data() {
    return {
      games: []
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('accessToken');
    }
  },
  methods: {
    async fetchGames() {
      try {
        const response = await axios.get('http://localhost:8000/api/games/');
        console.log("🎮 Received games:", response.data);
        this.games = response.data;
      } catch (error) {
        console.error("❌ Failed to fetch games:", error);
      }
    },
    viewReviews(gameId) {
      this.$router.push(`/reviews/${gameId}`);
    },
    handleAddGame() {
      console.log('Add game functionality will be implemented later');
    }
  },
  mounted() {
    this.fetchGames();
  }
};
</script>

<style scoped>
.home-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.title-section {
  flex: 1;
}

.title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 10px;
}

.subtitle {
  margin-bottom: 0;
  color: #666;
}

.add-game-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-game-btn:hover {
  background-color: #ff7875;
}

.add-game-btn i {
  font-size: 0.9em;
}

.games {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.game-card {
  border: 1px solid #ccc;
  padding: 15px;
  width: 300px;
  background: white;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.game-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
}

.info {
  margin-top: 10px;
}

.info h2 {
  font-size: 1.3em;
  margin-bottom: 10px;
  color: #333;
}

.details, .publisher {
  font-size: 0.9em;
  margin: 5px 0;
  color: #666;
}

.rating {
  font-size: 1.2em;
  color: #f5b301;
  margin: 15px 0;
}

.numeric-rating {
  font-size: 0.9em;
  margin-left: 5px;
  color: #333;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.view-btn, .reviews-btn {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  text-align: center;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
}

.view-btn {
  background-color: #ff4d4f;
  color: white;
}

.view-btn:hover {
  background-color: #ff7875;
}

.reviews-btn {
  background-color: white;
  color: #ff4d4f;
  border: 2px solid #ff4d4f;
  cursor: pointer;
}

.reviews-btn:hover {
  background-color: #fff1f0;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .add-game-btn {
    width: 100%;
    justify-content: center;
  }

  .games {
    justify-content: center;
  }
  
  .button-group {
    flex-direction: column;
  }
}
</style>
