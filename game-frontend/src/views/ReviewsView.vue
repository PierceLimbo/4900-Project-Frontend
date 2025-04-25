<template>
  <div class="reviews-page">
    <h1 class="page-title">Game Reviews</h1>

    <!-- Reviews list -->
    <div v-for="review in reviews" :key="review.id" class="review-card">
      <div class="review-header">
        <h3 class="game-title">{{ review.gameTitle }}</h3>
        <div class="review-rating">
          <span>Rating: </span>
          <span class="rating-stars">
            <!-- Dynamically display stars based on rating -->
            {{ getStarRating(review.rating) }}
          </span>
        </div>
      </div>

      <p class="review-text">"{{ review.reviewText }}"</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameReviews",
  data() {
    return {
      reviews: [
        {
          id: 1,
          gameTitle: "The Witcher 3",
          rating: 5,
          reviewText: "An amazing open-world RPG with an incredible story and characters.",
        },
        {
          id: 2,
          gameTitle: "Cyberpunk 2077",
          rating: 3,
          reviewText: "Had high hopes, but the game had many bugs. Still, a great story.",
        },
        {
          id: 3,
          gameTitle: "Minecraft",
          rating: 4,
          reviewText: "Endless possibilities and a great creative outlet. A bit too repetitive.",
        },
        {
          id: 4,
          gameTitle: "Red Dead Redemption 2",
          rating: 5,
          reviewText: "An incredible game with great attention to detail and an emotional story.",
        },
      ],
    };
  },
  methods: {
    getStarRating(rating) {
      let filledStars = '★'.repeat(rating); 
      let emptyStars = '☆'.repeat(5 - rating); 

      return filledStars + emptyStars; 
    }
  }
};
</script>

<style scoped>
.reviews-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 2em;
  font-weight: bold;
  margin-bottom: 20px;
}

.review-card {
  background-color: #f9f9f9;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-title {
  font-size: 1.5em;
  font-weight: bold;
}

.review-rating {
  font-size: 1.2em;
}

.rating-stars {
  color: #ffbf00; /* Yellow color for stars */
}

.review-text {
  font-size: 1em;
  margin-top: 10px;
  font-style: italic;
}

.review-user {
  margin-top: 10px;
  font-weight: 600;
}
</style>
