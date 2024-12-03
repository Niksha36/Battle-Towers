<template>
    <div>
        <div id="game-container" class="game-container"></div>
        <div v-if="showDialog" class="dialog-overlay">
            <div class="dialog-box">
                <h1>Выход из игры</h1>
                <p>Вы уверены, что хотите выйти?</p>
                <div class="buttons-wrapper">
                    <button @click="leaveGame">Выйти</button>
                    <button @click="hideDialog">Назад</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Phaser from "phaser";
import PlayScene from "../assets/PlayScene";
import axios from "axios";

export default {
    name: "PhaserGame",
    data() {
        return {
            showDialog: false,
        };
    },
    mounted() {
        const config = {
            type: Phaser.AUTO,
            width: 1920,
            height: 1080,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: -1000},
                    debug: false
                }
            },
            scene: [new PlayScene(this, this.$router)],
            parent: 'game-container',
        };
        this.game = new Phaser.Game(config);
    },

    methods: {
        displayDialog() {
            this.showDialog = true;
        },
        hideDialog() {
            this.showDialog = false;
            this.game.scene.resume('PlayScene');
        },
        leaveGame() {
            this.$router.push('/menu');
        },
        async get_top() {
            const response = await axios.get("http://localhost:8000/get_top", {
                    withCredentials: true,
                    params: {
                        "username": this.$store.state.username

                    }
                }
            )
            console.log(response.data)
        },

        async get_user_record() {
            const response = await axios.get("http://localhost:8000/get_user_record", {
                withCredentials: true,
                params: {
                    "username": this.$store.state.username,
                }
            })
            console.log(response.data)
        },

        async update_user_record() {
            const response = await axios.post("http://localhost:8000/update_user_record", {
                withCredentials: true,
                params: {
                    "username": this.$store.state.username,
                    "record": 0
                }
            })
            console.log(response.data.record)
        }
    }
}
</script>

<style>

.game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

body {
    display: flex;
    overflow: hidden;
    background-color: black;
}

.dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.dialog-box {
    background: white;
    padding: 30px;
    border-radius: 15px;
    min-width: 500px;
    border: 4px solid gold;
}

.dialog-box h1 {
    margin: 0;
    padding: 0;
    white-space: normal;
    font-size: 40px;
    font-weight: 700;
}
.dialog-box p{
    font-size: 25px;
}
.buttons-wrapper{
    display: flex;
    justify-content: space-between;
}
.buttons-wrapper button{
    border: none;
    padding: 10px 50px;
    background: #1D7E7C;
    color: white;
    font-size: 30px;
    border-radius: 15px;

}
.buttons-wrapper button:hover{
    background: #AA382C;
}
</style>
