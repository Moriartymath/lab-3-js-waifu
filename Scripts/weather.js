export default async function fetchWeather(city) {
  console.log('hello');
  const url = `http://api.weatherapi.com/v1/forecast.json?key=45d690a2e9744e09879101551242905&q=${city}`;
  const response = await fetch(url, { method: 'GET' });

  parseWeatherObj(await response.json());
}

const parseWeatherObj = function (weatherObj) {
  const { current, forecast, location } = weatherObj;
};
