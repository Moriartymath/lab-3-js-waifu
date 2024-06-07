'use strict';
import fetchWeather from './weather.ts';

console.log('Hi');
window.addEventListener('load', () => {
  fetchWeather(true);
  document.querySelector('.search').addEventListener('click', () => {
    fetchWeather();
  });
});
