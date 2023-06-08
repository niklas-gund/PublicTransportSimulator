export function coordinatesToMercator(lat: number, lon: number) {
  const mapWidth = 200;
  const mapHeight = 100;

  const x = (lon + 180) * (mapWidth / 360);
  const latRad = lat * (Math.PI / 180);
  const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  const y = mapHeight / 2 - (mapWidth * mercN) / (2 * Math.PI);
  return { x, y };
}
