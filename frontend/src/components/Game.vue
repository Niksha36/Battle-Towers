<template>
  <div>
    <div class="game-container">
      <ion-phaser
          v-bind:game.prop="game"
          v-bind:initialize.prop="true"
      />
    </div>
      <button @click="get_top">get_top</button>
      <button @click="get_user_record">get_user_record</button>
      <button @click="update_user_record">update_user_record</button>
  </div>
</template>

<script>
import Phaser from "phaser";

import PlayScene from "@/assets/PlayScene";
import axios from "axios";

export default {
  name: "Game",
  data() {
    return {
      game: {
        type: Phaser.AUTO,
        width: 1800,
        height: 1000,
        antialias: false,
        pixelArt: true,
        physics: {
          default: 'arcade',
          arcade: {
            gravity: {y: 2000},
            debug: false
          }
        },
        scene:
            [PlayScene]
      }
    }
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
      console.log(response.data)
    }
  }
}
</script>