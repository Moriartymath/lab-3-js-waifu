import * as L from 'leaflet';

class MapHandler {
  private static map: L.Map = L.map('map').setView([54.526, 15.2551], 6);

  static initMap(): void {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.map);
  }

  static setDisplayedPos(lat: number, lon: number, zoom: number = 10): void {
    this.map.flyTo([lat, lon], zoom);
  }
}

export { MapHandler as default };
