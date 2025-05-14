<template>
  <div class="browse-container">
    <h1>Browse Games</h1>
    
    <div class="filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search games..." 
          @input="filterGames"
        />
      </div>
      
      <div class="genre-filter">
        <select v-model="selectedGenre" @change="filterGames">
          <option value="">All Genres</option>
          <option v-for="genre in genres" :key="genre.genre_id" :value="genre.genre_id">
            {{ genre.genre_name }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="loading">
      <p>Loading games...</p>
    </div>
    
    <div v-else-if="filteredGames.length === 0" class="no-games">
      <p>No games found. Try adjusting your filters.</p>
    </div>
    
    <div v-else class="games-grid">
      <div 
        v-for="game in filteredGames" 
        :key="game.game_id" 
        class="game-card"
        @click="goToGameDetails(game.game_id)"
      >
        <div class="game-image">
          <img v-if="game.image" :src="game.image" :alt="game.title" />
          <div v-else class="placeholder-image">No image</div>
        </div>
        
        <div class="game-info">
          <h3>{{ game.title }}</h3>
          <div class="game-meta">
            <span class="platform">{{ game.platform }}</span>
            <span class="genre" v-if="game.genre_name">{{ game.genre_name }}</span>
          </div>
          <div class="rating">
            <span class="rating-value">{{ game.average_rating }}/5</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="add-game-prompt" v-if="isAuthenticated">
      <router-link to="/games/add" class="add-game-button">
        Add New Game
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'BrowseView',
  data() {
    return {
      games: [],
      genres: [],
      loading: true,
      searchQuery: '',
      selectedGenre: '',
      filteredGames: []
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('accessToken');
    }
  },
  created() {
    this.fetchGames();
    this.fetchGenres();
  },
  methods: {
    async fetchGames() {
      try {
        const response = await axios.get('http://localhost:8000/games/');
        this.games = response.data;
        this.filteredGames = [...this.games];
        this.loading = false;
      } catch (error) {
        console.error('Error fetching games:', error);
        this.loading = false;
      }
    },
    async fetchGenres() {
      try {
        const response = await axios.get('http://localhost:8000/api/genres/');
        this.genres = response.data;
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    },
    filterGames() {
      let filtered = [...this.games];

      if (this.searchQuery) {
        filtered = filtered.filter(game =>
          game.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.selectedGenre) {
        filtered = filtered.filter(game =>
          game.genres.some(genre => genre.id === this.selectedGenre)
        );
      }

      this.filteredGames = filtered;
    },
    goToGameDetails(gameId) {
      this.$router.push(`/games/${gameId}`);
    }
  }
};
</script>

<style scoped>
.browse-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}

.search-bar {
  flex: 1;
  max-width: 500px;
}

.search-bar input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
}

.search-bar input:focus {
  outline: none;
  border-color: #ff4d4f;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.genre-filter select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  background-color: white;
}

.genre-filter select:focus {
  outline: none;
  border-color: #ff4d4f;
}

.loading, .no-games {
  text-align: center;
  padding: 50px 0;
  color: #666;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
}

.game-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.game-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.game-image {
  height: 200px;
  overflow: hidden;
}

.game-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.game-card:hover .game-image img {
  transform: scale(1.05);
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #666;
}

.game-info {
  padding: 15px;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3em;
}

.game-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #666;
}

.rating {
  display: flex;
  align-items: center;
}

.rating-value {
  color: #ff4d4f;
  font-weight: 600;
}

.add-game-prompt {
  margin-top: 40px;
  text-align: center;
}

.add-game-button {
  display: inline-block;
  background-color: #ff4d4f;
  color: white;
  padding: 12px 25px;
  border-radius: 25px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.add-game-button:hover {
  background-color: #ff7875;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .search-bar {
    max-width: none;
  }
}
</style>
