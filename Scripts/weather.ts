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
    condition: { text: string; icon: string };
    temp_c: number;
  };
  forecast: {
    forecastday: Array<{ day: { maxtemp_c: number; mintemp_c: number } }>;
  };
  location: {
    name: string;
    lat: number;
    lon: number;
    localtime_epoch: number;
  };
};

const formaterTemp = Intl.NumberFormat(locale, {
  style: 'unit',
  unit: 'celsius',
});

async function fetchWeather(
  forecastDays: number = 1,
  searchCity?: string,
  ip?: boolean,
  targetEl?: HTMLElement
) {
  const city = searchCity || searchInput?.value;

  const baseForecastURL =
    'http://api.weatherapi.com/v1/forecast.json?key=45d690a2e9744e09879101551242905';

  const response = await axios.get(
    `${baseForecastURL}&q=${ip ? 'auto:ip' : city}${
      forecastDays > 1 ? '&q=' + forecastDays : ''
    }`
  );

  if (!targetEl)
    parseWeatherObj(response.data).then(coord => {
      const { lat, lon } = coord;
      MapHandler.setDisplayedPos(lat, lon);
    });
  else parseLocationWeather(response.data, targetEl, forecastDays);
}

const parseWeatherObj: (
  object: responseObj
) => Promise<{ lat: number; lon: number }> = async function (
  weatherObj: responseObj
) {
  const { current, location } = weatherObj;

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

const parseLocationWeather = async function (
  data: responseObj,
  el: HTMLElement,
  forecast: number
) {
  if (forecast === 1) parseNow(data, el);
  else parseForecast(data, el);
};
type El = HTMLElement | null;
const parseNow = function (data: responseObj, el: HTMLElement) {
  const cityNameVal = el.dataset.city;
  const localeTime = data.current.last_updated.split(' ').at(-1);
  const currentTempVal = data.current.temp_c;
  const { maxtemp_c, mintemp_c } = data.forecast.forecastday[0].day;
  const conditionText = data.current.condition.text;

  if (el) {
    const cityName: El = el.querySelector('.city--name');
    const timeEl: El = el.querySelector('.city--time');
    const cityCondition: El = el.querySelector('.city-condition');
    const currentTemp: El = el.querySelector('.city--current--temp');
    const lowestTemp: El = el.querySelector('.min--temp');
    const highestTemp: El = el.querySelector('.max--temp');
    setText(
      new Map([
        [cityName, cityNameVal],
        [timeEl, localeTime],
        [cityCondition, conditionText],
        [currentTemp, formaterTemp.format(currentTempVal)],
        [lowestTemp, `L:${mintemp_c.toFixed(1)}°`],
        [highestTemp, `H:${maxtemp_c.toFixed(1)}°`],
      ])
    );
  }
};
const setText = function (entries: Map<El, string | undefined>) {
  entries.forEach((val, key) => {
    if (key) key.textContent = val ?? '';
  });
};

const parseForecast = function (data: responseObj, el: HTMLElement) {};

export { fetchWeather, MapHandler, StoragePlaces };
