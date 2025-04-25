<template>
  <nav class="navbar">
    <div class="container">
      <div class="logo">🎮 GameCritiq</div>
      <input class="search" type="text" placeholder="🔍 Search games..." />
      <div class="links">
        <router-link to="/">Home</router-link>
        <router-link to="/browse">Browse</router-link>
        <router-link v-if="isAuthenticated" to="/reviews">My Reviews</router-link>

        <router-link v-if="!isAuthenticated" to="/login" class="login">Login</router-link>

        <a v-if="isAuthenticated" @click="handleLogout" class="login logout-btn">Logout</a>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    
    isAuthenticated() {
      return !!localStorage.getItem('accessToken');  
    }
  },
  methods: {
 
    handleLogout() {
      localStorage.removeItem('accessToken');  
      window.location.reload(); 
      window.location.replace('/'); 
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #ff4d4f;
  padding: 1rem;
  color: white;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.logo {
  font-size: 1.6rem;
  font-weight: bold;
}
.search {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: none;
  font-size: 1rem;
  max-width: 400px;
  background: white;
  color: #333;
}
.links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.links a {
  color: black;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
}
.links a:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
.links a.active-link {
  background-color: white;
  color: #ff4d4f;
}
.login {
  background-color: #fff;
  color: #111;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 2px solid white;
  transition: background-color 0.3s, color 0.3s;
}
.login:hover {
  background-color: #ffe8e8;
  color: #b40000;
  border-color: #ffe8e8;
}

.logout-btn {
  cursor: pointer;
  user-select: none;
  outline: none;
}
.logout-btn:hover {
  background-color: #ffe8e8; 
}
</style>
