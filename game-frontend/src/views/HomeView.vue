<template>
  <div class="home-view">
    <h1 class="title">Latest Reviews</h1>
    <p class="subtitle">See what players are saying across all games.</p>

    <div class="reviews">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <h2>Review by {{ review.user }} <br><br> {{ review.game }}</h2>
        <p class="comment">"{{ review.review_text }}"</p>
        <p class="meta">Rating: {{ review.rating }} / 10</p>
        <p class="meta">Posted: {{ new Date(review.created_at).toLocaleDateString() }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      reviews: []
    };
  },
  mounted() {
    axios.get('http://localhost:8000/api/reviews/')
      .then(response => {
        this.reviews = response.data;
      })
      .catch(error => {
        console.error("Failed to fetch reviews:", error);
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
.reviews {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.review-card {
  border: 1px solid #ccc;
  padding: 15px;
  width: 300px;
  background-color: #f9f9f9;
}
.comment {
  font-style: italic;
  margin-bottom: 10px;
}
.meta {
  font-size: 0.9em;
  color: #555;
}
</style>
