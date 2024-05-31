import scrollToCity from './mapHandler.js';
import axios from 'axios';

const city = document.querySelector('.city-name');
const currentTemp = document.querySelector('.temp');
const lastUpdateDate = document.querySelector('.date-time');
const weatherIcon = document.querySelector('.current-svg-weather');
const locale = window.navigator.language;
const searchInput = document.querySelector('.weather-search');
const formaterDate = Intl.DateTimeFormat(locale, {
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

const formaterTemp = Intl.NumberFormat(locale, {
  style: 'unit',
  unit: 'celsius',
});

async function fetchWeather() {
  const city = document.querySelector('.weather-search-city').value;

  const url = `http://api.weatherapi.com/v1/forecast.json?key=45d690a2e9744e09879101551242905&q=${city}`;

  const response = await axios.get(url);
  parseWeatherObj(response.data).then(coord => {
    const { lat, lon } = coord;
    scrollToCity(lat, lon, 15);
  });
}

const parseWeatherObj = async function (weatherObj) {
  const { current, forecast, location } = weatherObj;
  lastUpdateDate.textContent = formaterDate.format(
    new Date(current.last_updated)
  );
  city.textContent = location.name;
  currentTemp.textContent = formaterTemp.format(current.temp_c);
  weatherIcon.setAttribute('src', current.condition.icon);
  return { lat: location.lat, lon: location.lon };
};

export { fetchWeather as default };
