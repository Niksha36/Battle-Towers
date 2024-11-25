// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import RegistrationForm from './components/RegistrationForm.vue';
import LoginForm from './components/LoginForm.vue';
import Game from "@/components/Game.vue";

const routes = [
    { path: '/', redirect: '/register' },
    { path: '/register', component: RegistrationForm },
    { path: '/login', component: LoginForm },
    { path: '/game', component: Game},
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;