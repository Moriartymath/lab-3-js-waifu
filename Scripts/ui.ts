import { fetchWeather, MapHandler, StoragePlaces } from './weather';
import * as sideBar from './closeSideBar';
import WeatherInfo from './weatherInfo';

class UI {
  static displayUI(): void {
    this.displayMap();
    this.sideBarUI();
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
}

export { UI as default };
