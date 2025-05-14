<template>
  <div class="signup-container">
    <div class="signup-form">
      <h2>Create an Account</h2>
      
      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
      
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="username">Username*</label>
          <input 
            id="username"
            v-model="form.username"
            type="text"
            placeholder="Choose a username"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email*</label>
          <input 
            id="email"
            v-model="form.email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password*</label>
          <input 
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password2">Confirm Password*</label>
          <input 
            id="password2"
            v-model="form.password2"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>
        
        <button type="submit" :disabled="isSubmitting" class="signup-button">
          {{ isSubmitting ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>
      
      <div class="login-link">
        Already have an account? <router-link to="/login">Log in</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignUpView',
  data() {
    return {
      form: {
        username: '',
        email: '',
        password: '',
        password2: ''
      },
      isSubmitting: false,
      message: '',
      messageType: '',
      errors: {}
    };
  },
  methods: {
    validateForm() {
      this.errors = {};

      if (!this.form.username) {
        this.errors.username = 'Username is required';
      }

      if (!this.form.email) {
        this.errors.email = 'Email is required';
      } else if (!this.validateEmail(this.form.email)) {
        this.errors.email = 'Please enter a valid email address';
      }

      if (!this.form.password) {
        this.errors.password = 'Password is required';
      }

      if (this.form.password !== this.form.password2) {
        this.errors.confirmPassword = 'Passwords do not match';
      }

      return Object.keys(this.errors).length === 0;
    },
    async handleSignUp() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      this.message = '';
      
      try {
        const response = await axios.post('http://localhost:8000/register/', {
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
          password2: this.form.password2
        });
        
        console.log('Registration successful:', response.data);
        this.message = 'Account created successfully! You can now log in.';
        this.messageType = 'success';
        
        // Reset form after successful registration
        this.form = {
          username: '',
          email: '',
          password: '',
          password2: ''
        };
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          this.$router.push('/login');
        }, 2000);
      } catch (error) {
        console.error('Registration error:', error);
        this.message = 'Error creating account. Please try again.';
        this.messageType = 'error';
        
        if (error.response && error.response.data) {
          // Display more specific error messages if available
          const errors = error.response.data;
          if (typeof errors === 'object') {
            const errorMessages = [];
            for (const field in errors) {
              if (Array.isArray(errors[field])) {
                errorMessages.push(`${field}: ${errors[field].join(', ')}`);
              } else {
                errorMessages.push(`${field}: ${errors[field]}`);
              }
            }
            this.message = errorMessages.join('\n');
          }
        }
      } finally {
        this.isSubmitting = false;
      }
    },
    validateEmail(email) {
      // Implement your email validation logic here
      return true; // Placeholder return, actual implementation needed
    }
  }
};
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 20px;
}

.signup-form {
  width: 100%;
  max-width: 450px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

input:focus {
  border-color: #ff4d4f;
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
}

.signup-button {
  width: 100%;
  padding: 12px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.signup-button:hover {
  background-color: #ff7875;
}

.signup-button:disabled {
  background-color: #ffcccb;
  cursor: not-allowed;
}

.message {
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 4px;
  white-space: pre-line;
}

.message.error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}

.message.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.login-link {
  margin-top: 20px;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #ff4d4f;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
