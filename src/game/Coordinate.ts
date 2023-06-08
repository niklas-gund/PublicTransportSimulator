import { coordinatesToMercator } from "./Projection";
import type Station from "./Station";

export default class Coordinate {
  public static bboxMerc: {
    minMercX: number;
    minMercY: number;
    maxMercX: number;
    maxMercY: number;
  };
  public static screenWidth: number;
  public static screenHeight: number;

  constructor(public lat, public lon) {}

  public getMercCoordinates() {
    return coordinatesToMercator(this.lat, this.lon);
  }

  public getScreenCoordinates() {
    const mercatorCoordinates = this.getMercCoordinates();
    return this.earthToScreen(mercatorCoordinates.x, mercatorCoordinates.y);
  }

  private earthToScreen(mercX: number, mercY: number) {
    const lonDiff = Coordinate.bboxMerc.maxMercX - Coordinate.bboxMerc.minMercX;
    const latDiff = Coordinate.bboxMerc.maxMercY - Coordinate.bboxMerc.minMercY;

    const screenRation = Coordinate.screenWidth / Coordinate.screenHeight;
    const coordRatio = latDiff / lonDiff;
    const widthLimited = screenRation < coordRatio;
    const scalingFactor = widthLimited
      ? Coordinate.screenWidth / lonDiff
      : Coordinate.screenHeight / latDiff;
    return {
      x: (mercX - Coordinate.bboxMerc.minMercX) * scalingFactor * 3,
      y: (mercY - Coordinate.bboxMerc.minMercY) * scalingFactor * 3,
    };
  }
}

export function determineBoundingBox(cityList: Station[]): {
  minMercX: number;
  minMercY: number;
  maxMercX: number;
  maxMercY: number;
} {
  let minMercX = cityList[0].coordinate.getMercCoordinates().x;
  let minMercY = cityList[0].coordinate.getMercCoordinates().y;
  let maxMercX = cityList[0].coordinate.getMercCoordinates().x;
  let maxMercY = cityList[0].coordinate.getMercCoordinates().y;
  cityList.forEach((city) => {
    const mercCoordinates = city.coordinate.getMercCoordinates();
    if (mercCoordinates.x < minMercX) minMercX = mercCoordinates.x;
    if (mercCoordinates.x > maxMercX) maxMercX = mercCoordinates.x;
    if (mercCoordinates.y < minMercY) minMercY = mercCoordinates.y;
    if (mercCoordinates.y > maxMercY) maxMercY = mercCoordinates.y;
  });
  return {
    minMercX,
    minMercY,
    maxMercX,
    maxMercY,
  };
}
