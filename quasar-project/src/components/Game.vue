<template>
    <div>
        <div id="game-container" class="game-container"></div>
    </div>
</template>

<script>
import Phaser from "phaser";
import PlayScene from "../assets/PlayScene";
import axios from "axios";

export default {
    name: "PhaserGame",
    mounted() {
        const config = {
            type: Phaser.AUTO,
            width: 1920,
            height: 1080,
            antialias: false,
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: 7000},
                    debug: false
                }
            },
            scene: [PlayScene],
            parent: 'game-container',
        };
        this.game = new Phaser.Game(config);


    },

    methods: {
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
</style>
