import { fetchWeather, MapHandler } from './weather';
import * as sideBar from './closeSideBar';

class UI {
  static displayUI() {
    this.displayMap();
    this.sideBarUI();
  }
  private static displayMap(): void {
    window.addEventListener('load', () => {
      MapHandler.initMap();
      fetchWeather(true);
      document.querySelector('.search')?.addEventListener('click', () => {
        fetchWeather();
      });
    });
  }
  private static sideBarUI(): void {
    sideBar.closeSideBar();
  }
}

export { UI as default };
