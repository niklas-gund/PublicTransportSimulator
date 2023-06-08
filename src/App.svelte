<script lang="ts">
  import Phaser from "phaser";
  import TitleScene from "./scenes/TitleScene";
  import GameScene from "./scenes/GameScene";

  const config = {
    type: Phaser.AUTO,
    parent: "gameCanvas",
    width: document.body.clientWidth - 20,
    height: document.body.clientHeight - 20,
    pixelArt: true,
    backgroundColor: "#aaffdd",
    zoom: 1,
    dom: {
      createContainer: true,
    },
    physics: {
      default: "arcade",
    },
  };

  const game = new Phaser.Game(config);

  game.scene.add("TitleScene", TitleScene);
  game.scene.add("GameScene", GameScene);

  game.scene.start("GameScene");
</script>

<main />

<style>
  html {
    scroll-behavior: smooth;
  }

  body {
    margin: 0px;
  }

  body * {
    box-sizing: border-box;
    position: relative;
    /*font-family: "Roboto", sans-serif;*/
  }

  input {
    border-style: none;
  }
  input:focus {
    outline: none;
  }
</style>
