<template>
  <nav class="navbar">
    <div class="container">
      <router-link to="/" class="logo-area">
        <img
          src="@/assets/logo.png"
          alt="Logo"
          class="logo-image"
        />
      </router-link>

      <div class="links">
        <router-link to="/">Home</router-link>
        <router-link to="/browse">Browse</router-link>
        <router-link v-if="isAuthenticated" to="/reviews">My Reviews</router-link>
        <router-link v-if="isAuthenticated" to="/games/add" class="add-game-btn">Add Game</router-link>

        <router-link v-if="!isAuthenticated" to="/login" class="auth-btn login">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/signup" class="auth-btn signup">Sign Up</router-link>
        <button v-if="isAuthenticated" @click="handleLogout" class="auth-btn logout">
          Logout
        </button>
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
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      window.location.href = '/';
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

.logo-area {
  min-width: 100px;
  max-width: 200px;
}

.logo-image {
  height: 60px;
  width: auto;
  max-height: 60px;
  object-fit: contain;
}

.links {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.links a:not(.auth-btn):not(.add-game-btn) {
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s ease;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
}

.links a:not(.auth-btn):not(.add-game-btn):hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.links a:not(.auth-btn):not(.add-game-btn).router-link-active {
  background-color: white;
  color: #ff4d4f;
}

.add-game-btn {
  background-color: #ffd54f;
  color: #333;
  text-decoration: none;
  font-weight: 600;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.add-game-btn:hover {
  background-color: #ffb300;
}

.add-game-btn.router-link-active {
  background-color: #ffb300;
}

.auth-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid white;
}

.auth-btn.login {
  background-color: white;
  color: #ff4d4f;
  text-decoration: none;
}

.auth-btn.login:hover {
  background-color: #ffe8e8;
  color: #b40000;
  border-color: #ffe8e8;
}

.auth-btn.signup {
  background-color: transparent;
  color: white;
  text-decoration: none;
}

.auth-btn.signup:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.auth-btn.logout {
  background-color: transparent;
  color: white;
}

.auth-btn.logout:hover {
  background-color: white;
  color: #ff4d4f;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: stretch;
  }

  .logo-area {
    margin: 0 auto;
  }

  .links {
    justify-content: center;
  }
}
</style>
