import Phaser from "phaser";
import "./styles.css";
import { WORLD_HEIGHT, WORLD_WIDTH } from "./game/constants";
import { StarPickerScene, type StarPickerDebugApi } from "./game/StarPickerScene";
import { Hud } from "./ui/hud";

declare global {
  interface Window {
    __starPicker?: StarPickerDebugApi;
  }
}

const hud = new Hud();
const scene = new StarPickerScene(hud);

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: WORLD_WIDTH,
  height: WORLD_HEIGHT,
  backgroundColor: "#081821",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene,
});

window.__starPicker = scene.getDebugApi();
