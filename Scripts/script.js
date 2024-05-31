'use strict';
import fetchWeather from './weather.js';

window.addEventListener('load', () => {
  document.querySelector('.search').addEventListener('click', () => {
    fetchWeather();
  });
});
