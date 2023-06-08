import { GameObjects, type Scene } from "phaser";

export default abstract class GOCollection extends Phaser.GameObjects
  .Container {
  public collectionScale = 1;
  public collectionX: number;
  public collectionY: number;
  private collectionChildren: GameObjects.GameObject[] = [];

  public width: number;
  public height: number;

  public oriX = 0;
  public oriY = 0;

  constructor(
    scene: Scene,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    depth: number = 5
  ) {
    super(scene);
    this.setDepth(depth);

    this.type = type;
    this.collectionX = x;
    this.collectionY = y;
    this.width = width;
    this.height = height;
  }

  abstract build(): GameObjects.GameObject[];

  static preload(scene: Phaser.Scene): void {}

  private isScalable(object: any): object is GameObjects.Shape | GOCollection {
    return "setScale" in object;
  }

  public setFixedToCamera(fixed: boolean): this {
    this.setScrollFactor(fixed ? 0 : 1);
    return this;
  }

  public getX(): number {
    return this.getBounds().left;
  }

  public getY(): number {
    return this.getBounds().top;
  }

  public getHeight(): number {
    return this.getBounds().height * this.scale;
  }

  public getWidth(): number {
    return this.getBounds().width * this.scale;
  }

  public setChildren(children: GameObjects.GameObject[]): this {
    this.collectionChildren = children;
    return this;
  }

  public setPosition(x: number, y: number) {
    this.collectionX = x;
    this.collectionY = y;
    return this;
  }

  public setScale(scale: number): this {
    this.collectionScale = scale;
    return this;
  }

  public setOrigin(x: number, y: number) {
    this.oriX = x;
    this.oriY = y;
    return this;
  }

  public draw(): this {
    this.updateChildren();
    this.scene.add.existing(this);
    return this;
  }

  public updateChildren() {
    this.removeAll();

    // set scales
    this.add(this.build());
    this.add(this.collectionChildren);
    for (let child of this.getAll()) {
      var isText: boolean = child instanceof GameObjects.Text;
      if (this.isScalable(child)) {
        if (isText && !(child instanceof GOCollection)) {
        } else if (child instanceof GOCollection) {
          child.setPosition(
            child.collectionX * this.collectionScale,
            child.collectionY * this.collectionScale
          );
          child.updateChildren();
          continue;
        } else {
          child.setScale(child.scale * this.collectionScale);
        }
        child.setPosition(
          child.x * this.collectionScale,
          child.y * this.collectionScale
        );
      }
    }

    // set origin
    let newX = this.collectionX - this.getWidth() * this.oriX;
    let newY = this.collectionY - this.getHeight() * this.oriY;
    super.setPosition(newX, newY);

    // console.log(
    //   "type: " +
    //     this.type +
    //     "\nwidth:" +
    //     this.getWidth() +
    //     " height:" +
    //     this.getHeight() +
    //     "\nwScale:" +
    //     this.collectionScale + //" isChild:" + this.isChild +
    //     "\nx:" +
    //     this.collectionX +
    //     " y:" +
    //     this.collectionY +
    //     "\nx:" +
    //     this.getX() +
    //     " y:" +
    //     this.getY() +
    //     "\nnX:" +
    //     newX +
    //     " nY:" +
    //     newY
    // );
  }
}
