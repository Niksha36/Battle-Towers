<template>
    <div>
        <div id="game-container" class="game-container"></div>
        <div v-if="showDialog" class="dialog-overlay">
            <div class="dialog-box">
                <h1>Выход из игры</h1>
                <p>Вы уверены, что хотите выйти?</p>
                <div class="buttons-wrapper">
                    <button @click="leaveGame" @mouseover="playSelectTowerGame">Выйти</button>
                    <button @click="hideDialog" @mouseover="playSelectTowerGame">Назад</button>
                </div>
            </div>
        </div>
        <div v-if="showEndScreen" class="dialog-overlay">
        <div class="defeat-screen">
            <img src="../assets/background/lose_background.png" alt="/lose_background">
            <h1 class="defeat-text">Поражение</h1>
            <div class="defeat-info">
                <div v-if="isUserNotRegistered" class="warning-wrapper">
                    <img src="../assets/sprites/ic_warning.svg" alt="ic_warning">
                    <span class="warning-text">Вы не зарегистрированы</span>
                </div>
                <p v-else class="record">Ваш рекорд: {{ this.record }}</p>
                <p class="waves">Количество волн: {{ this.waves }}</p>
            </div>
            <div class="defeat-screen-buttons-wrapper">
                <button @click="startNewGame" @mouseover="playSelectTowerGame" class="new-game defeat-screen-button">
                    Новая игра
                </button>
                <button @click="viewRatings" @mouseover="playSelectTowerGame" class="rating defeat-screen-button">
                    Рейтинг
                </button>
                <button @click="goToMenu" @mouseover="playSelectTowerGame" class="menu defeat-screen-button">
                    Меню
                </button>
            </div>
        </div>
    </div>

    </div>
</template>

<script>
import  Phaser from "phaser";
import PlayScene from "../assets/PlayScene";
import stor from "../store.js"

//music
import buttonClickSound from "../assets/sounds/button_click.mp3"
import newWaveSound from "../assets/sounds/new_wave_sound.mp3"
import newWaveHoverSound from "../assets/sounds/menu_appearing.mp3"
import newLevelSound from "../assets/sounds/new_level.mp3"
import selectTower from "../assets/sounds/button_hover.mp3"
import buildingTowerSound from "../assets/sounds/building_tower_sound.mp3"
import glassTowerSound from "../assets/sounds/glass_tower_sound.mp3"
import towerHitSound from "../assets/sounds/tower_hit.mp3"
import towerDestroySound from "../assets/sounds/tower_destroy.mp3"
import loseSound from '../assets/sounds/lose_sound.mp3'
import gameMusic from '../assets/sounds/game_sound.mp3'
import diggingSound from '../assets/sounds/digging_sound.mp3'
import towerLevelUpSound from '../assets/sounds/tower_level_up.mp3'
import rerollSound from '../assets/sounds/reroll_sound.mp3'
import gameClickSound from '../assets/sounds/game_click.mp3'
import notEnoughMoney from '../assets/sounds/not_enought_money.mp3'
export default {
    name: "PhaserGame",
    data() {
        return {
            showDialog: false,
            showEndScreen: false,
            record: 0,
            waves: 0,
            hoverSoundGame: new Audio(buttonClickSound),
            newWaveSoundGame:new Audio(newWaveSound),
            newWaveHoverSoundGame:new Audio(newWaveHoverSound),
            newLevelSoundGame:new Audio(newLevelSound),
            selectTowerGame:new Audio(selectTower),
            buildingTowerSoundGame:new Audio(buildingTowerSound),
            glassTowerSoundGame:new Audio(glassTowerSound),
            towerHitSoundGame:new Audio(towerHitSound),
            towerDestroySoundGame:new Audio(towerDestroySound),
            loseSoundGame:new Audio(loseSound),
            gameMusicGame:new Audio(gameMusic),
            diggingSoundGame: new Audio(diggingSound),
            towerLevelUpSoundGame: new Audio(towerLevelUpSound),
            rerollSoundGame: new Audio(rerollSound),
            gameClickSoundGame: new Audio(gameClickSound),
            notEnoughMoneyGame:new Audio(notEnoughMoney)
        };
    },
    computed: {
        isUserNotRegistered() {
            return stor.state.username === "";
        }
    },
    mounted() {
        this.playNotEnoughMoneyGame = () => {
            const sound = new Audio(notEnoughMoney);
            sound.play()
        }
        this.playGameClickSound = () => {
            this.gameClickSoundGame.play();
        }
        this.playRerollSound = () => {
            const sound = new Audio(rerollSound);
            sound.play()
        }
        this.playTowerLevelUpSound = () => {
            const sound = new Audio(towerLevelUpSound);
            sound.play();
        }
        this.playDiggingSound = () => {
            this.diggingSoundGame.play();
        }
        this.playButtonClickSound = () => {
            this.hoverSoundGame.play();
        };
        this.playHoverSoundGame = () => {
            this.hoverSoundGame.play();
        };
        this.playNewWaveSoundGame = () => {
            this.newWaveSoundGame.play();
        };
        this.playNewWaveHoverSoundGame = () => {
            this.newWaveHoverSoundGame.play();
        };
        this.playNewLevelSoundGame = () => {
            this.newLevelSoundGame.play();
        };
        this.playSelectTowerGame = () => {
            this.selectTowerGame.play();
        };
        this.playBuildingTowerSoundGame = () => {
            const sound = new Audio(buildingTowerSound);
            sound.play();
        };
        this.playGlassTowerSoundGame = () => {
            this.glassTowerSoundGame.play();
        };
        this.playTowerHitSoundGame = () => {
            const sound = new Audio(towerHitSound);
            sound.play();
        };

        this.playTowerDestroySoundGame = () => {
            const sound = new Audio(towerDestroySound);
            sound.play();
        };
        this.playLoseSoundGame = () => {
            this.loseSoundGame.play();
        };
        this.playGameMusicGame = () => {
            this.gameMusicGame.volume = 0.2;
            this.gameMusicGame.loop = true;
            this.gameMusicGame.play();
        };
        this.stopGameMusicGame = () => {
            this.gameMusicGame.pause();
            this.gameMusicGame.currentTime = 0;
        };
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
            this.playButtonClickSound();
            this.game.scene.scenes[0].scene.restart();
            this.showEndScreen = false;
            this.game.scene.scenes[0].gameMusic.stop();
            this.gameMusic.play({ volume: 0.3, loop: true });
        },
        viewRatings() {
            this.playButtonClickSound();
            this.stopGameMusicGame();
            this.$router.push('/rating');
        },
        goToMenu() {
            this.playButtonClickSound();
            this.stopGameMusicGame();
            this.$router.push('/menu');
        },


        displayEndScreen() {
            this.playButtonClickSound();
            this.record = stor.state.record
            this.waves = this.game.scene.scenes[0].wave
            this.showEndScreen = true;
        },
        displayDialog() {
            this.playButtonClickSound();
            this.showDialog = true;
        },
        hideDialog() {
            this.playButtonClickSound();
            this.showDialog = false;
            this.game.scene.resume('PlayScene');
        },
        leaveGame() {
            this.playButtonClickSound();
            this.stopGameMusicGame();
            this.$router.push('/menu');
        },
    }
}
</script>

<style>
.warning-text{
    color: red;
    margin-left: 15px;
    font-size: 30px;
}
.warning-wrapper{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}
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
