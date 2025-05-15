<template>
  <div class="login-container">
    <h2 class="login-title">Welcome Back</h2>
    <p class="login-subtitle">Sign in to access your account</p>

    <p v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </p>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Username</label>
        <div class="input-wrapper">
          <i class="fas fa-user input-icon"></i>
          <input 
            id="username"
            v-model.trim="username" 
            type="text" 
            placeholder="Enter your username" 
            required
            class="form-input"
            :class="{ 'error': usernameError }"
            @input="validateUsername"
          />
        </div>
        <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <i class="fas fa-lock input-icon"></i>
          <input 
            id="password"
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Enter your password" 
            required
            class="form-input"
            :class="{ 'error': passwordError }"
            @input="validatePassword"
          />
          <button 
            type="button" 
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading || !isFormValid"
        class="submit-button"
      >
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <span v-else>Sign In</span>
      </button>
    </form>

    <div class="form-footer">
      <p class="signup-link">
        Don't have an account? 
        <router-link to="/signup">Create one now</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      error: '',
      isLoading: false,
      showPassword: false,
      usernameError: '',
      passwordError: ''
    };
  },
  computed: {
    isFormValid() {
      return this.username && this.password && !this.usernameError && !this.passwordError;
    }
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'Username is required';
      } else if (this.username.length < 3) {
        this.usernameError = 'Username must be at least 3 characters';
      } else {
        this.usernameError = '';
      }
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Password is required';
      } else if (this.password.length < 6) {
        this.passwordError = 'Password must be at least 6 characters';
      } else {
        this.passwordError = '';
      }
    },
    async handleLogin() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      this.error = '';

      try {
        const response = await axios.post('https://isqa4900.pythonanywhere.com/api/token/', {
          username: this.username,
          password: this.password
        });

        localStorage.setItem('accessToken', response.data.access);
        window.location.replace('/');
      } catch (error) {
        this.error = error.response?.data?.detail || 'Invalid username or password';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

.login-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.error-message {
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  margin-bottom: 1.5rem;
  border-radius: 6px;
  font-size: 0.875rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.form-input.error {
  border-color: #dc2626;
}

.error-text {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: block;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0;
}

.toggle-password:hover {
  color: #4f46e5;
}

.submit-button {
  width: 100%;
  padding: 0.875rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background-color: #4338ca;
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.form-footer {
  margin-top: 2rem;
  text-align: center;
}

.signup-link {
  font-size: 0.875rem;
  color: #666;
}

.signup-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.signup-link a:hover {
  color: #4338ca;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>
