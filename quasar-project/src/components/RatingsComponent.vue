<script setup>
import { ref } from 'vue';
import axios from "axios";
import stor from "../store.js"
import router from "src/router/index.js";
function backToMenu(){
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

console.log(data)
// console.log(response.status)

</script>

<template>
    <div class="background-wrapper">
        <img @click="backToMenu" src="../assets/sprites/ic_go_back.svg" alt="" class="back-button" width="150">
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
    top: 10px;
    left: 20px
}
.back-button:hover {
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
