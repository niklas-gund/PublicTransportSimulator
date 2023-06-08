import type { GameObjects, Scene } from "phaser";
import GOCollection from "./GOCollection";
import { debug } from "svelte/internal";

export default class UIFrame extends GOCollection {
  static readonly TEMPLATE_FRAME_WIDTH = 8;
  static readonly TITLE_SCALE = 2;
  static readonly FILE_NAMES = [
    "C_TL",
    "C_TR",
    "C_BL",
    "C_BR",
    "Top",
    "Bottom",
    "Left",
    "Right",
    "Deco_R",
    "Deco_L",
    "Deco_C",
  ];
  static readonly BACKGROUND_COLOR = 0xb7b7b7;
  private frameHeight;
  private textRef: Phaser.GameObjects.Text;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    depth: number = 5,
    private objectWidth: number,
    private objectHeight: number,
    private title = ""
  ) {
    super(scene, "UIFrame", x, y, objectWidth, objectHeight, depth);
    this.frameHeight =
      title == ""
        ? this.objectHeight
        : this.objectHeight -
          2 * UIFrame.TITLE_SCALE * UIFrame.TEMPLATE_FRAME_WIDTH;
  }

  static preload(scene: Phaser.Scene): void {
    this.FILE_NAMES.forEach((e) => {
      scene.load.image(e, `assets/sprites/UIFrame/${e}.png`);
    });
  }

  build(): GameObjects.GameObject[] {
    const result: GameObjects.GameObject[] = [];
    this.addCorners(result);
    this.drawSides(result);
    // fill in
    result.push(
      this.scene.add
        .rectangle(
          UIFrame.TEMPLATE_FRAME_WIDTH,
          UIFrame.TEMPLATE_FRAME_WIDTH + this.objectHeight - this.frameHeight,
          this.objectWidth - 2 * UIFrame.TEMPLATE_FRAME_WIDTH,
          this.frameHeight - 2 * UIFrame.TEMPLATE_FRAME_WIDTH,
          UIFrame.BACKGROUND_COLOR
        )
        .setOrigin(0, 0)
    );

    // add title if set
    this.addTitle(result);

    return result;
  }

  public setText(newText: string) {
    if (this.textRef == null) return;
    this.textRef.setText(newText);
  }

  private addTitle(result: GameObjects.GameObject[]) {
    if (this.title != "") {
      result.push(
        this.scene.add
          .image(0, 0, "Deco_L")
          .setOrigin(0, 0)
          .setScale(UIFrame.TITLE_SCALE),

        this.scene.add
          .image(this.width, 0, "Deco_R")
          .setOrigin(1, 0)
          .setScale(UIFrame.TITLE_SCALE)
      );
      for (
        let x = UIFrame.TEMPLATE_FRAME_WIDTH * UIFrame.TITLE_SCALE;
        x < this.width - UIFrame.TEMPLATE_FRAME_WIDTH * UIFrame.TITLE_SCALE;
        x += UIFrame.TITLE_SCALE
      ) {
        result.push(
          this.scene.add
            .image(x, 0, "Deco_C")
            .setOrigin(0, 0)
            .setScale(UIFrame.TITLE_SCALE)
        );
      }

      this.textRef = this.scene.add
        .text(
          this.width / 2,
          (UIFrame.TEMPLATE_FRAME_WIDTH * UIFrame.TITLE_SCALE) / 2,
          this.title,
          {
            fontSize: UIFrame.TITLE_SCALE * 12,
            color: "white",
          }
        )
        .setOrigin(0.5, 0.5);
      result.push(this.textRef);
    }
  }

  private drawSides(result: GameObjects.GameObject[]) {
    for (
      let w = 0;
      w < this.objectWidth - 2 * UIFrame.TEMPLATE_FRAME_WIDTH;
      w++
    ) {
      result.push(
        this.scene.add
          .image(
            UIFrame.TEMPLATE_FRAME_WIDTH + w,
            this.objectHeight - this.frameHeight,
            "Top"
          )
          .setOrigin(0, 0),
        this.scene.add
          .image(
            UIFrame.TEMPLATE_FRAME_WIDTH + w,
            this.objectHeight - UIFrame.TEMPLATE_FRAME_WIDTH,
            "Bottom"
          )
          .setOrigin(0, 0)
      );
    }

    for (
      let h = this.objectHeight - this.frameHeight;
      h < this.objectHeight - 2 * UIFrame.TEMPLATE_FRAME_WIDTH;
      h++
    ) {
      result.push(
        this.scene.add
          .image(0, UIFrame.TEMPLATE_FRAME_WIDTH + h, "Left")
          .setOrigin(0, 0),
        this.scene.add
          .image(
            this.objectWidth - UIFrame.TEMPLATE_FRAME_WIDTH,
            UIFrame.TEMPLATE_FRAME_WIDTH + h,
            "Right"
          )
          .setOrigin(0, 0)
      );
    }
  }

  private addCorners(result: GameObjects.GameObject[]) {
    result.push(
      this.scene.add
        .image(0, this.objectHeight - this.frameHeight, "C_TL")
        .setOrigin(0, 0),
      this.scene.add
        .image(
          this.objectWidth - UIFrame.TEMPLATE_FRAME_WIDTH,
          this.objectHeight - this.frameHeight,
          "C_TR"
        )
        .setOrigin(0, 0),
      this.scene.add
        .image(
          this.objectWidth - UIFrame.TEMPLATE_FRAME_WIDTH,
          this.objectHeight - UIFrame.TEMPLATE_FRAME_WIDTH,
          "C_BR"
        )
        .setOrigin(0, 0),
      this.scene.add
        .image(0, this.objectHeight - UIFrame.TEMPLATE_FRAME_WIDTH, "C_BL")
        .setOrigin(0, 0)
    );
  }
}
