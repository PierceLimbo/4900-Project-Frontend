<template>
  <div class="home-view">
    <h1 class="title">GameCritiq Library</h1>
    <p class="subtitle">Explore our entire collection of games rated by the community.</p>

    <div class="games">
      <div v-for="game in games" :key="game.id" class="game-card">
        <img :src="game.image" :alt="game.title" />
        <div class="info">
          <h2>{{ game.title }}</h2>
          <p class="details">{{ game.platform }} | {{ game.genre }}</p>
          <p class="publisher">By {{ game.publisher }} | {{ game.release_date }}</p>
          <p class="snippet">"{{ game.snippet }}"</p>
          <div class="rating">
            <span v-for="n in 10" :key="n">
              <i :class="n <= Math.round(game.average_rating) ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
            <span class="numeric-rating">({{ game.average_rating.toFixed(1) }}/10)</span>
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
  name: 'HomeView',
  data() {
    return {
      games: []
    };
  },
  mounted() {
    axios.get('http://localhost:8000/api/games/')
      .then(response => {
        console.log("🎮 Received games:", response.data);
        this.games = response.data;
      })
      .catch(error => {
        console.error("❌ Failed to fetch games:", error);
      });
  }
};
</script>

<style scoped>
.home-view {
  padding: 20px;
}
.title {
  font-size: 2em;
  font-weight: bold;
}
.subtitle {
  margin-bottom: 20px;
}
.games {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.game-card {
  border: 1px solid #ccc;
  padding: 10px;
  width: 300px;
}
.game-card img {
  width: 100%;
  height: auto;
}
.info {
  margin-top: 10px;
}
.details, .publisher, .snippet {
  font-size: 0.9em;
  margin: 5px 0;
}
.rating {
  font-size: 1.2em;
  color: #f5b301;
}
.rating i {
  margin-right: 2px;
}
.numeric-rating {
  font-size: 0.9em;
  margin-left: 5px;
  color: #333;
}
</style>
