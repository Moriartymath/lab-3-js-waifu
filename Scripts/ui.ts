import { fetchWeather, MapHandler, StoragePlaces } from './weather';
import * as sideBar from './closeSideBar';
import WeatherInfo from './weatherInfo';
import Forecast from './displayForecast';

class UI {
  static displayUI(): void {
    this.displayMap();
  }
  private static displayMap() {
    window.addEventListener('load', async () => {
      MapHandler.initMap();
      fetchWeather(1, undefined, true, undefined).then(res => {
        this.sideBarUI();
        this.displayForecast();
      });
      document.querySelector('.search')?.addEventListener('click', () => {
        fetchWeather().then(res => {
          WeatherInfo.addLocation(res);
        });
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
