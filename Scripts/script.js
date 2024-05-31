'use strict';
import fetchWeather, { hello } from './weather.js';

window.addEventListener('load', () => {
  document.querySelector('.search').addEventListener('click', () => {
    fetchWeather();
  });
});
