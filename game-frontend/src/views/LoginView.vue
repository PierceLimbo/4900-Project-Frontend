<template>
    <div style="max-width: 360px; margin: 3rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; margin-bottom: 1.5rem; color: #333; font-size: 1.5rem; font-weight: 600;">Sign In</h2>
      
      <p v-if="error" style="background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; margin-bottom: 1rem; border-radius: 6px; font-size: 0.875rem; text-align: center;">
        {{ error }}
      </p>
      
      <form @submit.prevent="handleLogin">
        <div style="margin-bottom: 1rem;">
          <input 
            v-model.trim="email" 
            type="email" 
            placeholder="Email" 
            required
            style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s ease;"
            @focus="e => e.target.style.borderColor = '#4f46e5'"
            @blur="e => e.target.style.borderColor = '#ddd'"
          />
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <input 
            v-model="password" 
            type="password" 
            placeholder="Password" 
            required
            style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s ease;"
            @focus="e => e.target.style.borderColor = '#4f46e5'"
            @blur="e => e.target.style.borderColor = '#ddd'"
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="isLoading"
          style="width: 100%; padding: 0.75rem; background-color: #4f46e5; color: white; font-weight: 600; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; transition: background-color 0.2s; margin-bottom: 1rem;"
          @mouseover="e => !isLoading && (e.target.style.backgroundColor = '#4338ca')"
          @mouseout="e => !isLoading && (e.target.style.backgroundColor = '#4f46e5')"
        >
          {{ isLoading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
      
      <p style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: #666;">
        Don't have an account? 
        <router-link to="/signup" style="color: #4f46e5; text-decoration: none; font-weight: 500;">Sign Up</router-link>
      </p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginView',
    data() {
      return {
        email: '',
        password: '',
        error: '',
        isLoading: false
      }
    },
    methods: {
      async handleLogin() {
        if (!this.email || !this.password) {
          this.error = 'Please enter both email and password';
          return;
        }
  
        this.isLoading = true;
        this.error = '';
        
      }
    }
  }
  </script>