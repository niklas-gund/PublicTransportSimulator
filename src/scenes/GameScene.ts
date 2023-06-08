import Phaser, { GameObjects } from "phaser";
import Station, { type stationCategory } from "../game/Station";
import { determineBoundingBox } from "../game/Coordinate";
import UIFrame from "../ui/UIFrame";
import Coordinate from "../game/Coordinate";
export default class GameScene extends Phaser.Scene {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super("GameScene");
  }

  private gameLayer: Phaser.GameObjects.GameObject[] = [];
  private uiLayer: Phaser.GameObjects.GameObject[] = [];
  private uiCamera: Phaser.Cameras.Scene2D.Camera;

  preload() {
    // load cities
    this.load.json("cities", "/assets/data/germanTrainStations.json");
    this.load.json("borders", "/assets/data/stateBorders.json");
    this.load.image("CityIndicator", "assets/sprites/CityIndicator.png");
    this.load.image("TownIndicator", "assets/sprites/TownIndicator.png");
    this.load.image("DorfIndicator", "assets/sprites/DorfIndicator.png");
    this.load.image("Cat3", "assets/sprites/Cat3.png");

    UIFrame.preload(this);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const bbox = this.createStationIndicators();

    // draw borders
    const borders = this.cache.json.get("borders");

    const borderPoints: Coordinate[][] = [];

    borders.features.forEach((state) => {
      state.geometry.coordinates.forEach((outline) => {
        const points: Coordinate[] = outline.map(
          (e) => new Coordinate(e[1], e[0])
        );
        borderPoints.push(points);
      });
    });

    borderPoints.forEach((state) => {
      const graphix = this.add.graphics({ x: 0, y: 0 });
      graphix.lineStyle(1, 0x000000);
      graphix.beginPath();
      const startingScreenCoordinate = state[0].getScreenCoordinates();
      graphix.moveTo(startingScreenCoordinate.x, startingScreenCoordinate.y);

      state.forEach((e) => {
        const screenCoordinates = e.getScreenCoordinates();
        console.log(screenCoordinates);
        graphix.lineTo(screenCoordinates.x, screenCoordinates.y);
      });
      graphix.closePath();
      graphix.strokePath();
      this.gameLayer.push(graphix);
    });

    // mouse zoom and pan
    const zoomSensitivity = 0.1;
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if (deltaY > 0) {
        let newZoom = this.cameras.main.zoom - zoomSensitivity;
        if (newZoom > 0) {
          this.cameras.main.zoom = newZoom;
        }
      }
      if (deltaY < 0) {
        let newZoom = this.cameras.main.zoom + zoomSensitivity;
        if (newZoom < 100) {
          this.cameras.main.zoom = newZoom;
        }
      }
    });

    this.input.on("pointermove", (pointer) => {
      if (!pointer.isDown) return;
      this.cameras.main.scrollX -=
        (pointer.x - pointer.prevPosition.x) / this.cameras.main.zoom;
      this.cameras.main.scrollY -=
        (pointer.y - pointer.prevPosition.y) / this.cameras.main.zoom;
    });

    const text = this.add
      .text(20, 20, "Jens", {
        fontSize: 64,
        color: "black",
      })
      .setScrollFactor(0);

    this.uiLayer.push(text);

    const frame = new UIFrame(
      this,
      this.cameras.main.width,
      this.cameras.main.height,
      5,
      180,
      80,
      "Click on city"
    )
      .setScale(2)
      .setFixedToCamera(true)
      .setOrigin(1, 1)
      .draw();

    this.uiLayer.push(frame);

    // assign cameras
    this.uiCamera = this.cameras.add(
      0,
      0,
      this.cameras.main.width,
      this.cameras.main.height
    );

    this.cameras.main.ignore(this.uiLayer);
    this.uiCamera.ignore(this.gameLayer);

    this.input.on("pointerdown", (pointer, objectsClicked) => {
      if (objectsClicked.length > 0)
        console.log(objectsClicked[0].data.values.city);
      text.setText(objectsClicked[0].data.values.city.name);
      frame.setText(objectsClicked[0].data.values.city.name);
    });
  }

  private createStationIndicators(): {
    minMercX: number;
    minMercY: number;
    maxMercX: number;
    maxMercY: number;
  } {
    let cities: Station[] = [];
    this.cache.json.get("cities").stations.forEach((e) => {
      // skip stations without position
      if (!e.position || !e.stationCategory) return;
      let category = parseInt(e.stationCategory.replace("CATEGORY_", ""));
      if (category > 7 || category < 1) category = 7;
      cities.push(
        new Station(
          e.names.DE.name,
          category as stationCategory,
          parseFloat(e.position.longitude),
          parseFloat(e.position.latitude)
        )
      );
    });
    let bbox = determineBoundingBox(cities);
    // setup coordinates
    Coordinate.bboxMerc = bbox;
    Coordinate.screenHeight = this.cameras.main.displayHeight;
    Coordinate.screenWidth = this.cameras.main.displayWidth;

    cities.forEach((city) => {
      const cityScreenCoords = city.coordinate.getScreenCoordinates();

      const indicator = this.physics.add
        .sprite(
          cityScreenCoords.x,
          cityScreenCoords.y,
          this.getSpriteOnCategory(city.category)
        )
        .setOrigin(0.5, 0.5)
        .setScale(this.getScaleBasedOnCategory(city.category))
        .setData("city", city)
        .setInteractive();

      this.gameLayer.push(indicator);
    });
    return bbox;
  }

  getSpriteOnCategory(category: stationCategory) {
    if (category == 1) return "CityIndicator";
    if (category == 2) return "TownIndicator";
    if (category == 3) return "Cat3";
    return "DorfIndicator";
  }

  getScaleBasedOnCategory(category: stationCategory) {
    if (category == 1) return 0.18;
    if (category == 2) return 0.12;
    return 0.1;
  }

  update(time: number, delta: number): void {
    this.handleCameraMovement();
  }

  handleCameraMovement() {
    // cursor movement
    const movementSensitivity = 30 * (1 / this.cameras.main.zoom);
    if (this.cursors.left.isDown) {
      this.cameras.main.scrollX -= movementSensitivity;
    }
    if (this.cursors.right.isDown) {
      this.cameras.main.scrollX += movementSensitivity;
    }
    if (this.cursors.up.isDown) {
      this.cameras.main.scrollY -= movementSensitivity;
    }
    if (this.cursors.down.isDown) {
      this.cameras.main.scrollY += movementSensitivity;
    }
  }
}
