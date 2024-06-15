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
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        avghumidity: number;
        avgtemp_c: number;
        condition: { text: string; icon: string };
        uv: number;
      };
      hour: Array<{
        feelslike_c: number;
        humidity: number;
        temp_c: number;
        time: string;
        uv: number;
        wind_kph: number;
        pressure_mb: number;
        gust_kph: number;
        chance_of_rain: number;
        condition: { text: string; icon: string };
      }>;
    }>;
  };
  location: {
    name: string;
    lat: number;
    lon: number;
    localtime_epoch: number;
    localtime: string;
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
      forecastDays > 1 ? '&days=' + forecastDays : ''
    }`
  );
  console.log(response.data);

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

const parseForecast = function (data: responseObj, el: HTMLElement) {
  const arrForecast = data.forecast.forecastday;
  const weatherDivDetails = document.querySelector(
    '.weather--details--forecast'
  );
  const localTime = new Date(data.location.localtime);
  const localHour = localTime.getHours();

  let dayHTMLStr: string = '';
  let nowHourlyForecast: string = '';

  arrForecast.forEach((day, index) => {
    let hourHTMLStr: string = '';
    const {
      avgtemp_c,
      maxtemp_c,
      mintemp_c,
      uv: uvDay,
      avghumidity,
      condition: { text, icon },
    } = day.day;
    const currentDay = new Date();
    const forecastDay = new Date(day.date);

    day.hour.forEach(hourForecast => {
      const {
        feelslike_c,
        humidity,
        temp_c,
        time,
        uv: uvHour,
        wind_kph,
        pressure_mb,
        gust_kph,
        chance_of_rain,
        condition: { text: textCondition, icon: urlIcon },
      } = hourForecast;
      const innerContent = `<div class="hour-forecast"> <p class="current-hour">${Intl.DateTimeFormat(
        'uk-UA',
        {
          hour: '2-digit',
        }
      ).format(new Date(time))}</p>
      <img src="${urlIcon}" alt="weather" class="weather-condition-img"/>
      <p class="temp--hour">${temp_c}°</p>
      </div>`;
      const hour = new Date(time).getHours();
      if (
        (localHour <= hour && forecastDay.getDate() === localTime.getDate()) ||
        (forecastDay.getDate() === localTime.getDate() + 1 && localHour >= hour)
      ) {
        nowHourlyForecast += innerContent;
      }
      hourHTMLStr += innerContent;
    });

    dayHTMLStr += `
      <div class="day--forecast" data-date=${day.date} data-day=${index + 1}>
      <p class="day-text">${
        forecastDay.getDate() === currentDay.getDate()
          ? 'Today'
          : Intl.DateTimeFormat('en-UK', {
              weekday: 'long',
            }).format(forecastDay)
      }</p>
       <div class="hourly--forecast">
        <h3>Hourly Forecast</h3>
        <div class="slider">
        ${hourHTMLStr}
        </div>
       </div>
      </div> 
      `;
  });

  if (weatherDivDetails) {
    weatherDivDetails.innerHTML = `<div class="main-forecast">${dayHTMLStr}</div>`;
    weatherDivDetails.insertAdjacentHTML(
      'afterbegin',
      `<div class="hourly--forecast now"><div class="slider">${nowHourlyForecast}</div></div>`
    );
    const firstHourForecast = document
      .querySelector('.now')
      ?.firstElementChild?.querySelector('.current-hour');
    if (firstHourForecast) firstHourForecast.textContent = 'now';
  }
};

export { fetchWeather, MapHandler, StoragePlaces };
