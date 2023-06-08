import Coordinate from "./Coordinate";

export type stationCategory = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default class Station {
  name: string;
  category: stationCategory;
  coordinate: Coordinate;
  constructor(
    name: string,
    category: stationCategory,
    lon: number,
    lat: number
  ) {
    this.name = name;
    this.category = category;
    this.coordinate = new Coordinate(lat, lon);
  }
}
