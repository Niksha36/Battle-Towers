<template>
    <div class="background-wrapper">
        <div class="left-decoration">
            <img src="../assets/towers/towerS_4.png" alt="left-decoration" width="500">
        </div>
        <div class="right-decoration">
            <img src="../assets/towers/towerS_8.png" alt="right-decoration" width="500">
        </div>
        <div class="login-form">
            <h2>Вход</h2>
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="text">Никнейм:</label>
                    <div class="input-wrapper">
                        <input type="text" v-model="username" placeholder="Введите никнейм" required/>
                    </div>
                </div>
                <div class="form-group">
                    <label for="password">Пароль:</label>
                    <div class="input-wrapper">
                        <input :type="showPassword ? 'text' : 'password'" v-model="password"
                               placeholder="Введите пароль" required/>
                        <img :src="showPassword ? showPasswordIcon : hidePasswordIcon" @click="togglePassword"
                             class="password-toggle-icon"/>
                    </div>
                </div>
                <button type="submit" class="submit-button">Войти</button>
                <p class="signup-link">
                    Нет аккаунта?
                    <router-link to="/register">Зарегистрироваться</router-link>
                </p>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import stor from "../store.js"
import showPasswordIcon from '../assets/sprites/show-password.svg';
import hidePasswordIcon from '../assets/sprites/hide-password.svg';
import router from "../router/index.js";

import {useRouter} from 'vue-router'

export default {
    data() {
        return {
            username: '',
            password: '',
            showPassword: false,
            showPasswordIcon,
            hidePasswordIcon
        };
    },
    methods: {
        togglePassword() {
            this.showPassword = !this.showPassword;
        },
        async login() {
            try {
                const response = await axios.post('http://localhost:8000/login_user', {
                    withCredentials: true,
                    username: this.username,
                    password: this.password
                });
                await this.$router.push({path: "game"});
                await stor.dispatch("updateUsername", this.username)
                await stor.dispatch("updateRecord", response.data.record)
            } catch (error) {
                console.error('Login failed:', error);
                alert('Ошибка входа: неверный никнейм или пароль');
            }
        }
    }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

.left-decoration {
    position: absolute;
    left: 0;
    bottom: -10px;
}

.right-decoration {
    position: absolute;
    right: 0;
    bottom: -10px;
    transform: scaleX(-1);
}

.background-wrapper {
    position: relative;
    display: flex;
    width: 100vw;
    height: 100vh;
    background-image: url("../assets/background/special_background.png");
    background-size: cover;
    justify-content: center;
    align-items: center;
}

.login-form {
    font-family: 'Roboto', sans-serif !important;
}

.login-form {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    padding: 1.5rem;
    padding-bottom: 2rem;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
}

h2 {
    font-family: 'Roboto', sans-serif;
    text-align: center;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 50px;
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
    font-size: 20px;
    margin-bottom: 0.5rem;
}

input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 20px;
    border-radius: 4px;
    background: #f9f9f9
}

.input-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
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
    margin-top: 15px;
    font-size: 25px;
    width: 100%;
    padding: 1rem;
    border: none;
    background-color: #28a745;
    color: white;
    border-radius: 5px;
    cursor: pointer;
}

.submit-button:hover {
    background-color: #218838;
}

.signup-link {
    font-size: 25px;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 0;
}

.signup-link > *:first-child {
    margin-left: 0.2rem;
    font-weight: 700;
}

.signup-link a {
    text-decoration: none;
    color: dodgerblue;
}
.password-toggle-icon{
    width: 35px;
}
</style>
