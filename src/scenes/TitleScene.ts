import Phaser from "phaser";

export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {}

  create() {
    const titleText = this.add.text(25, 25, "MarvelousMashup.ru", {});
    titleText.setFontFamily("Roboto");
    titleText.setFontSize(45 * 3);
    titleText.setStroke("#FF0000", 15);
  }
}
