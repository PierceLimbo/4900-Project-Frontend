<template>
  <div class="home-view">
    <h1 class="title">GameCritiq Library</h1>
    <p class="subtitle">Explore our entire collection of games rated by the community.</p>

    <div class="games">
      <div v-for="game in filteredGames" :key="game.id" class="game-card">
        <img :src="game.image" :alt="game.title" />
        <div class="info">
          <h2>{{ game.title }}</h2>
          <p class="publisher"><b>By:</b> {{ game.publisher }}  <br><b>Release Date</b>: {{ game.release_date }}</p>
          <p class="details"><b>Where You Can Play</b>: {{ game.platform }}
          <br> <b>Genre</b>: {{ game.genre }}</p>
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
import auth from '@/services/auth';;
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: 'HomeView',
  setup() {
    const games = ref([]);
    const route = useRoute();

    const fetchGames = async () => {
      try {
        const response = await auth.get('/api/games/');
        games.value = response.data;
      } catch (error) {
        console.error(' Failed to fetch games:', error);
      }
    };

    const filteredGames = computed(() => {
      const search = route.query.search ? route.query.search.toLowerCase() : '';
      if (!search) {
        return games.value;
      }
      return games.value.filter(game =>
        game.title.toLowerCase().includes(search)
      );
    });

    onMounted(() => {
      fetchGames();
    });

    // Optional: re-fetch games if route changes (like a new search)
    watch(
      () => route.query.search,
      () => {
        // No need to refetch, because we are filtering locally
      }
    );

    return {
      games,
      filteredGames
    };
  }
}
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
