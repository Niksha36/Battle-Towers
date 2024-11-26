<template>
  <div>
    <div class="game-container">
      <ion-phaser
          v-bind:game.prop="game"
          v-bind:initialize.prop="true"
      />
    </div>
  </div>
</template>

<script>
import Phaser from "phaser";

import PlayScene from "@/assets/PlayScene";

export default {
  name: "Game",
  data() {
    return {
      game: {
        type: Phaser.AUTO,
        width: 1300,
        height: 800,
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
}
</script>