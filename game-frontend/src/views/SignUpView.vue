<template>
    <div style="max-width: 360px; margin: 3rem auto; padding: 2rem; background: white; border-radius: 10px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);">
      <h2 style="text-align: center; margin-bottom: 1.5rem; color: #333; font-size: 1.5rem; font-weight: 600;">Sign Up</h2>
  
      <p v-if="error" style="background-color: #fee2e2; color: #b91c1c; padding: 0.75rem; margin-bottom: 1rem; border-radius: 6px; font-size: 0.875rem; text-align: center;">
        {{ error }}
      </p>
  
      <form @submit.prevent="handleSignUp">
        <div style="margin-bottom: 1rem;">
          <input 
            v-model="username" 
            type="text" 
            placeholder="Username" 
            required
            style="width: 100%; padding: 0.70rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s ease;"
            @focus="e => e.target.style.borderColor = '#4f46e5'"
            @blur="e => e.target.style.borderColor = '#ddd'"
          />
        </div>
  
        <div style="margin-bottom: 1rem;">
          <input 
            v-model="email" 
            type="email" 
            placeholder="Email" 
            required
            style="width: 100%; padding: 0.70rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s ease;"
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
  
        <div style="margin-bottom: 1.5rem;">
          <input 
            v-model="password2" 
            type="password" 
            placeholder="Confirm Password" 
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
          {{ isLoading ? 'Creating account...' : 'Sign Up' }}
        </button>
      </form>
  
      <p style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem; color: #666;">
        Already have an account? 
        <router-link to="/login" style="color: #4f46e5; text-decoration: none; font-weight: 500;">Log In</router-link>
      </p>
    </div>
  </template>
  
  <script>
  import auth from '../services/auth';  // Importing Axios service
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        password2: '',
        isLoading: false,
        error: ''
      };
    },
    methods: {
      async handleSignUp() {
        if (this.password !== this.password2) {
          this.error = "Passwords don't match!";
          return;
        }
  
        this.isLoading = true;
        this.error = '';
  
        try {
          // Fix: Use the correct endpoint path according to your Django URLs
          const response = await auth.post('api/register/', {
            username: this.username,
            email: this.email,
            password: this.password,
            password2: this.password2
          });
  
          console.log('Registration successful:', response.data);
          // After successful signup, redirect to login page
          this.$router.push('/login');
        } catch (error) {
          console.error('Registration error:', error.response?.data || error);
          
          // Improved error handling to show specific validation errors
          if (error.response?.data) {
            // For field errors (Django REST framework format)
            if (typeof error.response.data === 'object') {
              const errorMessages = [];
              for (const [field, messages] of Object.entries(error.response.data)) {
                if (Array.isArray(messages)) {
                  errorMessages.push(`${field}: ${messages.join(', ')}`);
                } else {
                  errorMessages.push(`${field}: ${messages}`);
                }
              }
              this.error = errorMessages.join('\n');
            } else {
              this.error = error.response.data.detail || 'Registration failed. Please try again.';
            }
          } else {
            this.error = 'Network error. Please check your connection.';
          }
        } finally {
          this.isLoading = false;
        }
      }
    }
  };
  </script>