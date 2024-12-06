<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { createStore } from 'vuex';
import stor from "../store.js";
import offSoundCondition from '../assets/sprites/audio-off.svg';
import onSoundCondition from '../assets/sprites/audio-on.svg';
import buttonHoverSound from '../assets/sounds/button_hover.mp3';
import buttonClickSound from '../assets/sounds/button_click.mp3';
import menuAppearingSound from '../assets/sounds/menu_appearing.mp3';
import gameMenuMusic from '../assets/sounds/game_menu_music.mp3';
const router = useRouter();



function getUser() {
    return stor.state.username
}
function redirectToGame() {
    playClickSound()
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    router.push('/game');
}
function redirectToRating(){
    playClickSound()
    router.push('/rating');
}

function logout() {
    playClickSound()
    stor.dispatch("logout")
    isLogging.value = false
}

function login() {
    playClickSound()
    router.push("/login")
}
function closeGame() {
    playClickSound()
    window.close();
}
//звуки кнопок
const hoverSound = new Audio(buttonHoverSound);
const clickSound = new Audio(buttonClickSound);
const appearingSound = new Audio(menuAppearingSound);
const backgroundMusic = new Audio(gameMenuMusic);

function playHoverSound() {
    hoverSound.play();
}

function playClickSound() {
    clickSound.play();
}

const isSoundOn = ref(false);

function toggleSound() {
    isSoundOn.value = !isSoundOn.value;
    if (isSoundOn.value) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    } else {
        backgroundMusic.pause();
    }
}

const isLogging = ref(getUser());

onMounted(() => {
    if (isSoundOn.value) {
        backgroundMusic.loop = true;
        backgroundMusic.play();
    }
});

onBeforeUnmount(() => {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
});
</script>
<template>
    <div class="background-wrapper">
        <img :src="isSoundOn ? onSoundCondition : offSoundCondition" alt="" class="audio-switcher" @click="toggleSound">
        <div class="game-menu">
            <h1>Battle Towers</h1>
            <div class="button-wrapper">
                <button class="play" @click="redirectToGame" @mouseover="playHoverSound">
                    Играть
                </button>
                <button class="rating" @click="redirectToRating" @mouseover="playHoverSound">
                    Рейтинг
                </button>
                <button v-if="!isLogging" class="quit" @click="login" @mouseover="playHoverSound">
                    Войти
                </button>
                <button v-else class="quit" @click="logout" @mouseover="playHoverSound">
                    Выйти
                </button>
                <button class="close-game" @click="closeGame" @mouseover="playHoverSound">
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
    position: relative;
}
.audio-switcher{
    position: absolute;
    left: 15px;
    top: 15px;
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
    cursor: pointer ;
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
    margin-left: 0;
    margin-right: 0;
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
.close-game{
    background: #a10202!important;
}
.close-game:hover{
    background: #e80000 !important;
}
</style>
