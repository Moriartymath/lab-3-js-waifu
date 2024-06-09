import MapHandler from './mapHandler.ts';
import StoragePlaces from './storage.ts';
import axios from 'axios';

const city = document.querySelector('.city-name');
const currentTemp = document.querySelector('.temp');
const lastUpdateDate = document.querySelector('.date-time');
const weatherIcon = document.querySelector('.current-svg-weather');
const locale = window.navigator.language;
const searchInput: HTMLInputElement | null = document.querySelector(
  '.weather-search-city'
);
const formaterDate = Intl.DateTimeFormat(locale, {
  hour: '2-digit',
  minute: '2-digit',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
});

type responseObj = {
  current: {
    last_updated: string;
    condition: { icon: string };
    temp_c: number;
  };
  forecast: { temp_c: number };
  location: { name: string; lat: number; lon: number };
};

const formaterTemp = Intl.NumberFormat(locale, {
  style: 'unit',
  unit: 'celsius',
});

async function fetchWeather(searchCity?: string, ip?: boolean) {
  const city = searchCity || searchInput?.value;

  const baseForecastURL =
    'http://api.weatherapi.com/v1/forecast.json?key=45d690a2e9744e09879101551242905&q=';

  const response = await axios.get(baseForecastURL + (ip ? 'auto:ip' : city));

  parseWeatherObj(response.data).then(coord => {
    const { lat, lon } = coord;
    MapHandler.setDisplayedPos(lat, lon);
  });
}

const parseWeatherObj: (
  object: responseObj
) => Promise<{ lat: number; lon: number }> = async function (
  weatherObj: responseObj
) {
  const { current, forecast, location } = weatherObj;

  if (lastUpdateDate)
    lastUpdateDate.textContent = formaterDate.format(
      new Date(current.last_updated)
    );

  if (city) city.textContent = location.name;
  StoragePlaces.setItem(location.name);

  if (currentTemp)
    currentTemp.textContent = formaterTemp.format(current.temp_c);

  weatherIcon?.setAttribute('src', current.condition.icon);
  return { lat: location.lat, lon: location.lon };
};

export { fetchWeather, MapHandler, StoragePlaces };
