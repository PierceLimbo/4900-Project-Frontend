<template>
  <div class="add-game-page">
    <h1>Add New Game</h1>
    <div class="form-container">
      <GameForm @game-added="handleGameAdded" />
    </div>
  </div>
</template>

<script>
import GameForm from '@/components/GameForm.vue';

export default {
  name: 'AddGameView',
  components: {
    GameForm
  },
  methods: {
    handleGameAdded(game) {
      // Redirect to the game detail page after successful creation
      this.$router.push(`/games/${game.game_id}`);
    }
  }
};
</script>

<style scoped>
.add-game-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
}

.form-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
</style>
