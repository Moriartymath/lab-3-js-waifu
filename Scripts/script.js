'use strict';
import fetchWeather from './weather.js';

window.addEventListener('load', () => {
  fetchWeather('Kyiv');
});

// Intl.DateTimeFormat('ua-US', {
//   hour: '2-digit',
//   minute: '2-digit',
//   weekday: 'short',
//   day: 'numeric',
//   month: 'short',
// });
