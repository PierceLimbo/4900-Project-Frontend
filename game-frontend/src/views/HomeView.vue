<template>
  <div class="home-view">
    <h1 class="title">GameCritiq Picks</h1>
    <p class="subtitle">Check out some of the top rated games by our community.</p>

    <div class="games">
      <div v-for="game in featuredGames" :key="game.id" class="game-card">
        <img :src="game.image" :alt="game.title" />
        <div class="info">
          <h2>{{ game.title }}</h2>
          <p class="details">{{ game.platform }} | {{ game.genre }}</p>
          <p class="publisher">By {{ game.publisher }} | {{ game.release_date }}</p>
          <p class="snippet">"{{ game.snippet }}"</p>
          <div class="rating">⭐⭐⭐⭐☆</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      featuredGames: [
        {
          id: 1,
          title: 'The Last of Us Part II',
          platform: 'PS4',
          genre: 'Action',
          snippet: 'Really good and intense.',
          publisher: 'Naughty Dog',
          release_date: '2020-06-19',
          //image: add link to image
        },
        {
          id: 2,
          title: 'Halo Infinite',
          platform: 'Xbox',
          genre: 'Shooter',
          snippet: 'Fun with friends.',
          publisher: '343 Industries',
          release_date: '2021-12-08',
          //image: add link to image
        },
        {
          id: 3,
          title: 'Animal Crossing: New Horizons',
          platform: 'Switch',
          genre: 'Simulation',
          snippet: 'Cute and relaxing.',
          publisher: 'Nintendo',
          release_date: '2020-03-20',
          //image: add link to image
        }
      ]
    }
  }
}
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
.title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #d32323;
  text-align: left;
}
.subtitle {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: #555;
  text-align: left;
}
.games {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}
.game-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.2s ease;
  width: 300px;
}
.game-card:hover {
  transform: translateY(-5px);
}
.game-card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}
.info {
  padding: 1rem;
}
.info h2 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
  color: #222;
}
.details, .publisher {
  font-size: 0.9rem;
  color: #666;
  margin: 0.25rem 0;
}
.snippet {
  font-style: italic;
  color: #444;
  margin-top: 0.5rem;
}
.rating {
  margin-top: 0.5rem;
  color: #f39c12;
  font-size: 1.2rem;
}
</style>