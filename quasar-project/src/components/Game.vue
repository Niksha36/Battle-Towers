<template>
    <div>
        <div id="game-container" class="game-container"></div>
        <div v-if="showDialog" class="dialog-overlay">
            <div class="dialog-box">
                <h1>Выход из игры</h1>
                <p>Вы уверены, что хотите выйти?</p>
                <div class="buttons-wrapper">
                    <button @click="leaveGame" @mouseover="playHoverSound">Выйти</button>
                    <button @click="hideDialog" @mouseover="playHoverSound">Назад</button>
                </div>
            </div>
        </div>
        <div v-if="showEndScreen" class="dialog-overlay">
        <div class="defeat-screen">
            <img src="../assets/background/lose_background.png" alt="/lose_background">
            <h1 class="defeat-text">Поражение</h1>
            <div class="defeat-info">
                <p class="record">Ваш рекорд: {{ this.record }}</p>
                <p class="waves">Количество волн: {{ this.waves }}</p>
            </div>
            <div class="defeat-screen-buttons-wrapper">
                <button @click="startNewGame" @mouseover="playHoverSound" class="new-game defeat-screen-button">
                    Новая игра
                </button>
                <button @click="viewRatings" @mouseover="playHoverSound" class="rating defeat-screen-button">
                    Рейтинг
                </button>
                <button @click="goToMenu" @mouseover="playHoverSound" class="menu defeat-screen-button">
                    Меню
                </button>
            </div>
        </div>
    </div>

    </div>
</template>

<script>
import Phaser from "phaser";
import PlayScene from "../assets/PlayScene";
import stor from "../store.js"
import buttonClickSound from "../assets/sounds/button_click.mp3"

export default {
    name: "PhaserGame",
    data() {
        return {
            showDialog: false,
            showEndScreen: false,
            record: 0,
            waves: 0,
            hoverSound: new Audio(buttonClickSound)
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
        startNewGame() {
            this.game.scene.scenes[0].scene.restart();
            this.showEndScreen = false;
            this.game.scene.scenes[0].gameMusic.stop();
            this.gameMusic.play({ volume: 0.3, loop: true });
        },
        viewRatings() {
            this.game.scene.scenes[0].gameMusic.stop();
            this.$router.push('/rating');
        },
        goToMenu() {
            this.game.scene.scenes[0].gameMusic.stop();
            this.$router.push('/menu');
        },


        displayEndScreen() {
            this.record = stor.state.record
            this.waves = this.game.scene.scenes[0].wave
            this.showEndScreen = true;
        },
        displayDialog() {
            this.showDialog = true;
        },
        hideDialog() {
            this.showDialog = false;
            this.game.scene.resume('PlayScene');
        },
        leaveGame() {
            this.game.scene.scenes[0].gameMusic.stop();
            this.$router.push('/menu');
        },
        playHoverSound() {
            this.hoverSound.play();
        }
    }
}
</script>

<style>
.defeat-text{
    color: #600000;
    font-size: 40px;
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    top: -47px;
}
.defeat-screen{
    position: relative;
}
.defeat-info{
    position: absolute;
    left: 30px;
    top: 100px
}
.record, .waves{
    font-size: 30px;
    color: rgba(255, 255, 255, 0.8);
}
.game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
.defeat-screen-buttons-wrapper{
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}
.defeat-screen-button{
    background: #1D7E7C;
    padding: 10px 30px;
    border: none;
    color: rgba(255, 255, 255, 0.8);
    border-radius: 15px;
    font-size: 25px;
    cursor: pointer;
}
.defeat-screen-button:hover{
    background: #149f9b;
}
.rating{
    margin: 0 30px;
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
    background: rgba(255, 255, 255, 0.6);
    padding: 30px;
    border-radius: 15px;
    min-width: 500px;
}

.dialog-box h1 {
    margin: 0;
    padding: 0;
    white-space: normal;
    font-size: 40px;
    font-weight: 700;
}

.dialog-box p {
    font-size: 25px;
}

.buttons-wrapper {
    display: flex;
    justify-content: space-between;
    margin-top: 35px;
}

.buttons-wrapper button {
    border: none;
    padding: 10px 50px;
    background: #1D7E7C;
    color: #dddddd;
    font-size: 30px;
    border-radius: 15px;

}

.buttons-wrapper button:hover {
    background: #AA382C;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.defeat-screen {
    animation: fadeIn 0.7s ease-in-out;
}
</style>
