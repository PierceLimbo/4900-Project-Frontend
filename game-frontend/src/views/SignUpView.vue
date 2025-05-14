<template>
  <div class="signup-container">
    <h2 class="signup-title">Create Account</h2>
    <p class="signup-subtitle">Join our gaming community today</p>

    <p v-if="error" class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      {{ error }}
    </p>

    <form @submit.prevent="handleSignUp" class="signup-form">
      <div class="form-group">
        <label for="username">Username</label>
        <div class="input-wrapper">
          <i class="fas fa-user input-icon"></i>
          <input 
            id="username"
            v-model.trim="username" 
            type="text" 
            placeholder="Choose a username" 
            required
            class="form-input"
            :class="{ 'error': usernameError }"
            @input="validateUsername"
          />
        </div>
        <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <div class="input-wrapper">
          <i class="fas fa-envelope input-icon"></i>
          <input 
            id="email"
            v-model.trim="email" 
            type="email" 
            placeholder="Enter your email" 
            required
            class="form-input"
            :class="{ 'error': emailError }"
            @input="validateEmail"
          />
        </div>
        <span v-if="emailError" class="error-text">{{ emailError }}</span>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <i class="fas fa-lock input-icon"></i>
          <input 
            id="password"
            v-model="password" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Create a password" 
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

      <div class="form-group">
        <label for="password2">Confirm Password</label>
        <div class="input-wrapper">
          <i class="fas fa-lock input-icon"></i>
          <input 
            id="password2"
            v-model="password2" 
            :type="showPassword ? 'text' : 'password'" 
            placeholder="Confirm your password" 
            required
            class="form-input"
            :class="{ 'error': password2Error }"
            @input="validatePassword2"
          />
        </div>
        <span v-if="password2Error" class="error-text">{{ password2Error }}</span>
      </div>

      <button 
        type="submit" 
        :disabled="isLoading || !isFormValid"
        class="submit-button"
      >
        <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
        <span v-else>Create Account</span>
      </button>
    </form>

    <div class="form-footer">
      <p class="login-link">
        Already have an account? 
        <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUpView',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      password2: '',
      error: '',
      isLoading: false,
      showPassword: false,
      usernameError: '',
      emailError: '',
      passwordError: '',
      password2Error: ''
    };
  },
  computed: {
    isFormValid() {
      return this.username && 
             this.email && 
             this.password && 
             this.password2 && 
             !this.usernameError && 
             !this.emailError && 
             !this.passwordError && 
             !this.password2Error;
    }
  },
  methods: {
    validateUsername() {
      if (!this.username) {
        this.usernameError = 'Username is required';
      } else if (this.username.length < 3) {
        this.usernameError = 'Username must be at least 3 characters';
      } else if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
        this.usernameError = 'Username can only contain letters, numbers, and underscores';
      } else {
        this.usernameError = '';
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.emailError = 'Email is required';
      } else if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid email address';
      } else {
        this.emailError = '';
      }
    },
    validatePassword() {
      if (!this.password) {
        this.passwordError = 'Password is required';
      } else {
        this.passwordError = '';
      }
      if (this.password2) {
        this.validatePassword2();
      }
    },
    validatePassword2() {
      if (!this.password2) {
        this.password2Error = 'Please confirm your password';
      } else if (this.password2 !== this.password) {
        this.password2Error = 'Passwords do not match';
      } else {
        this.password2Error = '';
      }
    },
    async handleSignUp() {
      if (!this.isFormValid) return;

      this.isLoading = true;
      this.error = '';

      try {
        await axios.post('http://127.0.0.1:8000/api/register/', {
          username: this.username,
          email: this.email,
          password: this.password,
          password2: this.password2
        });

        window.location.replace('/login');
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create account';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
.signup-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.signup-title {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

.signup-subtitle {
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

.login-link {
  font-size: 0.875rem;
  color: #666;
}

.login-link a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.login-link a:hover {
  color: #4338ca;
  text-decoration: underline;
}

@media (max-width: 480px) {
  .signup-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style>