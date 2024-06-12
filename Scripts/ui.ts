import { fetchWeather, MapHandler, StoragePlaces } from './weather';
import * as sideBar from './closeSideBar';
import WeatherInfo from './weatherInfo';
import Forecast from './displayForecast';

class UI {
  static displayUI(): void {
    this.displayMap();
    this.sideBarUI();
    this.displayForecast();
  }
  private static displayMap(): void {
    window.addEventListener('load', () => {
      MapHandler.initMap();
      fetchWeather(1, undefined, true);
      document.querySelector('.search')?.addEventListener('click', () => {
        fetchWeather();
      });
    });
  }
  private static sideBarUI(): void {
    sideBar.closeSideBar();
    WeatherInfo.displayUI();
  }

  private static displayForecast(): void {
    Forecast.displayUI();
  }
}

export { UI as default };
