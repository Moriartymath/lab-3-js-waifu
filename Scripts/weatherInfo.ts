import StoragePlaces from './storage';
import { fetchWeather } from './weather';

const recentPlaces = document.querySelector('.recent-locations');

class WeatherInfo {
  static displayUI(): void {
    this.diplayRecentPlaces();
  }

  private static diplayRecentPlaces(): void {
    const allPlaces = StoragePlaces.getAllPlaces();

    allPlaces.forEach(placeName => {
      const htmlStr = `
      <div class="place ${placeName.toLowerCase()}--place" data-city="${placeName}">
      <div class="location--date">
      <a class="city--name">${placeName}</a>
      <p class="city--time">${Intl.DateTimeFormat('uk-UK', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(Date.now())}</p>
      <p class="city-condition">Cloudy</p>
      </div>
      <div class="city--conditions"> 
      <span class="city--current--temp">27C</span>
      <div class="temp-low--high"> 
      <span class="max--temp">H:23</span>
      <span class="min--temp">L:10</span>
      </div>
      </div>
      </div>
      `;

      recentPlaces?.insertAdjacentHTML('beforeend', htmlStr);
      this.setUpdateTime(placeName.toLowerCase());
    });
  }

  private static setUpdateTime(cityTag: string): void {
    const cityElement: HTMLElement | null = document.querySelector(
      `.${cityTag}--place`
    );
    console.log(cityElement);
    if (!cityElement) return;
    const args = [1, cityElement.dataset.city, undefined, cityElement];
    setInterval(fetchWeather, 1000 * 60, ...args);
  }
}

export { WeatherInfo as default };
