<script setup>
import {onBeforeMount, onBeforeUnmount, ref} from 'vue';
import axios from "axios";
import stor from "../store.js"
import router from "src/router/index.js";
import gameMenuMusic from "assets/sounds/game_menu_music.mp3";
import buttonHoverSound from '../assets/sounds/button_hover.mp3';
import buttonClickSound from '../assets/sounds/button_click.mp3';

const hoverSound = new Audio(buttonHoverSound);
const clickSound = new Audio(buttonClickSound);
const backgroundMusicMenu = new Audio(gameMenuMusic);
const isPlaying = stor.state.isMenuMusicPlaying
const currentTime = stor.state.time
console.log(stor.state.isMenuMusicPlaying)
console.log(stor.state.time)
backgroundMusicMenu.currentTime = currentTime
if (isPlaying) {
    backgroundMusicMenu.loop = true
    backgroundMusicMenu.play()
}

function backToMenu(){
    clickSound.play();
    router.push('/menu')
}
let data = ref([])
let response = axios.get("http://localhost:8000/get_top", {
    withCredentials: true,
    params: {
        "username": stor.state.username
        }
    }
).then((r) => {
    data.value = r.data
    }
)

onBeforeUnmount(() => {
    stor.dispatch("updateMusicState", {
        isPlaying: !backgroundMusicMenu.paused,
        currentTime: backgroundMusicMenu.currentTime ? backgroundMusicMenu.currentTime : 0}
    )
    backgroundMusicMenu.pause();
    backgroundMusicMenu.currentTime = 0;
})

</script>

<template>
    <div class="background-wrapper">
        <img @click="backToMenu" @mouseover="hoverSound.play()" src="../assets/sprites/ic_go_back.svg" alt="" class="back-button" width="150">
        <div class="ratings-table">
            <h1>Рейтинг</h1>
            <table>
                <thead>
                <tr>
                    <th>Место</th>
                    <th>Игрок</th>
                    <th>Волны</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(rating, index) in data" :key="index">
                        <td v-if="index>4">...</td>
                        <td v-else>{{ index + 1 }}</td>
                        <td>{{ rating.username }}</td>
                        <td>{{ rating.record }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style scoped>
.back-button{
    position: absolute;
    opacity: 0.7;
    top: 10px;
    left: 20px
}
.back-button:hover {
    opacity: 1;
    cursor: pointer;
    content: url('../assets/sprites/ic_go_back_hover.svg');
}

.background-wrapper{
    width: 100vw;
    height: 100vh;
    background: #1D7E7C;
    background-image: url("../assets/background/rating_background.jpg");
    background-size: cover;
    overflow-y: auto;
    max-height: 100%;
    position: relative;
}
.ratings-table {
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.ratings-table table {
    width: 70%;
    border-spacing: 40px 12px;
    border: none;

}

.ratings-table th{
    padding: 8px;
    text-transform: uppercase;
    background: #AA382C;
    text-align: center;
    font-size: 40px;
    color: #EDDDB8;
    min-width: 420px;

}
.ratings-table td{
    background: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    font-size: 40px;
    text-align: center;
    padding: 20px;
}

h1{
    color: white;
    background: #AA382C;
    padding: 50px 20px 30px 20px;
    border: 5px solid gold;
    border-radius: 10px;
    font-size: 130px;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    margin-bottom: 50px;
    margin-top: 70px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.ratings-table tbody tr:nth-child(1) td,
.ratings-table tbody tr:nth-child(2) td,
.ratings-table tbody tr:nth-child(3) td {
    font-size: 50px; /* Adjust the size as needed */
}
.ratings-table tbody tr:nth-child(1) td:nth-child(1) {
    color: #FFD700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.ratings-table tbody tr:nth-child(2) td:nth-child(1) {
    color: #c5c9c7;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.ratings-table tbody tr:nth-child(2) td:nth-child(1) {
    color: #c5c9c7;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
.ratings-table tbody tr:nth-child(3) td:nth-child(1) {
    color: #cd7f32;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

</style>
