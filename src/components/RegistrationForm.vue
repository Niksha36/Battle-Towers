<template>
  <div class="register-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="nickname">Никнейм:</label>
        <div class="input-wrapper">
          <input type="text" v-model="nickname" placeholder="Введите никнейм" required/>
        </div>
      </div>
      <div class="form-group">
        <label for="password">Пароль:</label>
        <div class="input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="Введите пароль" required/>
          <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" @click="togglePassword"></i>
        </div>
      </div>
      <div class="form-group">
        <div class="input-wrapper">
          <input :type="showPassword ? 'text' : 'password'" v-model="repeatPassword" placeholder="Повторите пароль"
                 required/>
        </div>
      </div>
      <button type="submit" class="submit-button">Зарегистрироваться</button>
      <p class="signin-link">
        Уже есть аккаунт? <router-link to="/login">Войти</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nickname: '',
      password: '',
      repeatPassword: '',
      showPassword: false
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async register() {
      if (this.password !== this.repeatPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        const response = await axios.post('http://your-django-backend.com/api/register/', {
          nickname: this.nickname,
          password: this.password
        });
        console.log('Registered:', response.data);
        // Здесь крч будем редиректить в игру :)
      } catch (error) {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
      }
    }
  }
};
</script>

<style scoped>
.register-form, .register-form *:not(i) {
  font-family: 'Roboto', sans-serif;
}
.register-form {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
}

h2 {
  font-family: 'Roboto', sans-serif;
  text-align: center;
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}
.input-wrapper:focus-within {
  border-color: #007bff;
}
label {
  display: block;
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 0.5rem;
}

input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  border-radius: 4px;
}

.input-wrapper{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border: 1.5px solid #ccc;
  border-radius: 5px;
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
.signin-link{font-size:16px;display:flex; justify-content: center; margin-top: 1rem ; margin-bottom: 0}
.signin-link > *:first-child {
  margin-left: 0.2rem;
  font-weight: 700;
}
.signin-link a {
  text-decoration: none;
  color: dodgerblue;
}
</style>