<template>
  <div class="login-form">
    <h2>Вход</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="text">Никнейм:</label>
        <div class="input-wrapper">
          <input type="text" v-model="username" placeholder="Введите никнейм" required />
        </div>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <div class="input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Введите пароль" required />
          <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePassword"></i>
        </div>
      </div>
      <button type="submit" class="submit-button">Войти</button>
      <p class="signup-link">
        Нет аккаунта? <router-link to="/register">Зарегистрироваться</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

import router from "@/router.js";

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        console.log("123")
        const response = await axios.post('http://localhost:8000/login_user', {
          username: this.username,
          password: this.password
        });
        console.log('Logged in:', response.data);
        await router.push("game");
      } catch (error) {
        console.error('Login failed:', error);
        alert('Ошибка входа: неверный никнейм или пароль');
      }
    }
  }
};
</script>

<style scoped>
.login-form, .login-form *:not(i) {
  font-family: 'Roboto', sans-serif;
}
.login-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.signup-link a {
  text-decoration: none;
  color: dodgerblue;
}
h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 4px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.input-wrapper:focus-within {
  border-color: #007bff;
}
i {
  padding-left: 10px;
  cursor: pointer;
  color: gray;
}

i:hover {
  color: #222222;
}

.submit-button {
  font-size: 16px;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #218838;
}
.signup-link{font-size:16px;display:flex; justify-content: center; margin-top: 1rem ; margin-bottom: 0}
.signup-link > *:first-child {
  margin-left: 0.2rem;
  font-weight: 700;
}
</style>