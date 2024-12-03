<script setup>
import { useRouter } from 'vue-router';
import stor from "../store.js"
const router = useRouter();

function getUser() {
    return stor.state.username
}
function redirectToGame() {
    router.push('/game');
}
function redirectToRating(){
    router.push('/rating');
}

function logout() {
    this.$store.dispatch("logout")
    console.log(this.$store.state)
}

function login() {
    router.push("/login")
}
function closeGame() {
    window.close();
}
</script>
<template>
    <div class="background-wrapper">
        <div class="game-menu">
            <h1>Battle Towers</h1>
            <div class="button-wrapper">
                <button class="play" @click="redirectToGame">
                    Играть
                </button>
                <button class="rating" @click="redirectToRating">
                    Рейтинг
                </button>
                <button v-if="!getUser()" class="quit" @click="login">
                    Войти
                </button>
                <button v-else class="quit" @click="logout">
                    Выйти
                </button>
                <button class="close-game" @click="closeGame">
                    Закрыть
                </button>
            </div>
        </div>
    </div>
</template>
<style scoped>
.background-wrapper{
    width: 100vw;
    height: 100vh;
    background-size: cover;
    background-image: url('../assets/background/background.png') !important;
}
.game-menu {
    font-family: 'Roboto', sans-serif;
    position: absolute;
    bottom: 25%;
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.game-menu .button-wrapper button {
    border: 7px solid #c2b067;
    border-radius: 30px;
    padding: 10px 20px;
    background: #1D7E7C;
    color: #EDDDB8;
    font-size: 50px;
    width: 100%;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-top: 20px;
    font-weight: 500;
}
.game-menu .button-wrapper button:hover {
    background: #AA382C;
}
.button-wrapper {
    padding: 0 15%
}
.game-menu h1 {
    text-shadow:
        -5px -5px 0 #c2b067,
        5px -5px 0 #c2b067,
        -5px 5px 0 #c2b067,
        5px 5px 0 #c2b067;
    font-family: 'Roboto', sans-serif !important;
    font-weight: 700;
    font-size: 200px;
    margin: 0 0 100px 0;
    color: #E1491A;
    white-space: nowrap;
}
</style>
