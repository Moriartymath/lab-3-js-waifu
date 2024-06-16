import StoragePlaces from './storage';
import { fetchWeather } from './weather';

const recentPlaces = document.querySelector('.recent-locations');

class WeatherInfo {
  static displayUI(): void {
    this.diplayRecentPlaces();
    this.updateWeather();
  }
  static addLocation(newLoc: string | undefined) {
    const recenLoc = document.querySelector(
      `.${newLoc?.toLocaleLowerCase()}--place`
    );

    if (!recenLoc) {
      this.diplayRecentPlaces(true);
      this.updateWeather();
    }
  }

  private static diplayRecentPlaces(onlyOneLoc: boolean = false): void {
    let allPlaces = StoragePlaces.getAllPlaces();

    if (onlyOneLoc) allPlaces = allPlaces.slice(-1);

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
      <p class="max--temp">H:23</p>
      <p class="min--temp">L:10</p>
      </div>
      </div>
      </div>
      `;

      recentPlaces?.insertAdjacentHTML('beforeend', htmlStr);
      this.setUpdateTime(placeName.toLowerCase());
    });
  }

  private static setUpdateTime(cityTag: string, updateTime: number = 60): void {
    const cityElement: HTMLElement | null = document.querySelector(
      `.${cityTag}--place`
    );
    if (!cityElement) return;
    const args: Array<number | string | undefined | HTMLElement> = [
      1,
      cityElement.dataset.city,
      undefined,
      cityElement,
    ];
    if (updateTime === 0) fetchWeather(...args);
    else setInterval(fetchWeather, 1000 * 60, ...args);
  }
  static updateWeather(): void {
    const allPlaces = StoragePlaces.getAllPlaces();
    allPlaces.forEach(placeName =>
      this.setUpdateTime(placeName.toLowerCase(), 0)
    );
  }
}

export { WeatherInfo as default };
