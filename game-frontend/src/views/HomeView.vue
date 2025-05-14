<template>
  <div class="home-view">
    <div class="hero-section">
      <h1 class="title">Welcome to GameCritiq</h1>
      <p class="subtitle">Your trusted source for game reviews and ratings</p>
    </div>

    <div class="features-section">
      <div class="feature-card">
        <i class="fas fa-star"></i>
        <h2>Rate Games</h2>
        <p>Share your thoughts and rate your favorite games on a 5-star scale</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-comments"></i>
        <h2>Write Reviews</h2>
        <p>Write detailed reviews to help other gamers make informed decisions</p>
      </div>

      <div class="feature-card">
        <i class="fas fa-search"></i>
        <h2>Discover Games</h2>
        <p>Browse through our extensive collection of games and find your next favorite</p>
      </div>
    </div>

    <div class="cta-section">
      <h2>Ready to Start?</h2>
      <p>Join our community of game enthusiasts today</p>
      <div class="cta-buttons">
        <router-link to="/browse" class="cta-button primary">Browse Games</router-link>
        <router-link v-if="!isAuthenticated" to="/login" class="cta-button secondary">Sign In</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

export default {
  name: 'HomeView',
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('accessToken');
    }
  }
};
</script>

<style scoped>
.home-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 40px;
}

.title {
  font-size: 3em;
  font-weight: bold;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 1.5em;
  opacity: 0.9;
}

.features-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.feature-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-card i {
  font-size: 2.5em;
  color: #ff4d4f;
  margin-bottom: 20px;
}

.feature-card h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

.cta-section {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.cta-section h2 {
  font-size: 2em;
  margin-bottom: 15px;
  color: #333;
}

.cta-section p {
  font-size: 1.2em;
  color: #666;
  margin-bottom: 30px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.cta-button {
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button.primary {
  background-color: #ff4d4f;
  color: white;
}

.cta-button.primary:hover {
  background-color: #ff7875;
}

.cta-button.secondary {
  background-color: white;
  color: #ff4d4f;
  border: 2px solid #ff4d4f;
}

.cta-button.secondary:hover {
  background-color: #fff1f0;
}

@media (max-width: 768px) {
  .title {
    font-size: 2.5em;
  }
  
  .subtitle {
    font-size: 1.2em;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-button {
    width: 100%;
  }
}
</style>
