const map = L.map('map').setView([54.526, 15.2551], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

function scrollToCity(x, y, zoom) {
  map.flyTo([x, y], zoom);
}

export { scrollToCity as default };
