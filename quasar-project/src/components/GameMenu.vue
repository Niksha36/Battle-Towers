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
    backgroundMusicMenu.pause();
    backgroundMusicMenu.currentTime = 0;
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
const backgroundMusicMenu = new Audio(gameMenuMusic);

function playHoverSound() {
    hoverSound.play();
}

function playClickSound() {
    clickSound.play();
}

const isSoundOn = ref(stor.state.isMenuMusicPlaying);

function toggleSound() {
    isSoundOn.value = !isSoundOn.value;console.log(isSoundOn.value)
    stor.dispatch("updateMusicState", {
        isPlaying: isSoundOn.value,
        currentTime: backgroundMusicMenu.currentTime
    })

    if (isSoundOn.value) {
        backgroundMusicMenu.loop = true;
        backgroundMusicMenu.play();
    } else {
        backgroundMusicMenu.pause();
    }
}
function getParticleStyle(index) {
    const top = Math.random() * 100 + 'vh';
    const left = Math.random() * 100 + 'vw';
    const delay = (index * 0.07) + 's';
    return {
        top,
        left,
        animationDelay: delay,
    };
}
const particles = ref(Array.from({ length: 100 }, (_, index) => index));
const isLogging = ref(getUser());
const startTime = stor.state.time

onMounted(() => {
    if (isSoundOn.value) {
        backgroundMusicMenu.loop = true;
        backgroundMusicMenu.currentTime = startTime
        backgroundMusicMenu.play();
    }
});

onBeforeUnmount(() => {
    stor.dispatch("updateMusicState", {
        isPlaying: !backgroundMusicMenu.paused,
        currentTime: backgroundMusicMenu.currentTime ? backgroundMusicMenu.currentTime : 0}
    )
    backgroundMusicMenu.pause();
    backgroundMusicMenu.currentTime = 0;
});
</script>
<template>
    <div class="background-wrapper">
        <div class="particle" v-for="n in particles" :key="n" :style="getParticleStyle(n)"></div>
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
    background: #136e6c;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
;

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
.particle {
    position: absolute;
    width: 10px;
    height: 10px;
    background: rgba(255, 251, 0, 0.7);
    border-radius: 50%;
    animation: fly 10s linear infinite;
}

@keyframes fly {
    0% {
        transform: translateY(0) translateX(0);
        opacity: 1;
    }
    50% {
        opacity: 1;
    }
    100% {
        transform: translateY(-100vh) translateX(100vw);
        opacity: 0;
    }
}

</style>
