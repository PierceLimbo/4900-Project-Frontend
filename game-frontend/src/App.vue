<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  }
}
</script>

<style>
body, html, #app {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  background: #fafafa;
  color: #333;
}
</style>