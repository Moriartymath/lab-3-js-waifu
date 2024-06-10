import StoragePlaces from './storage';

const recentPlaces = document.querySelector('.recent-locations');

class WeatherInfo {
  static displayUI(): void {
    this.diplayRecentPlaces();
  }

  private static diplayRecentPlaces(): void {
    const allPlaces = StoragePlaces.getAllPlaces();

    allPlaces.slice().forEach(placeName => {
      const htmlStr = `
      <div class="place ${placeName.toLowerCase()}--place">
      <div class="location--date">
      <a class="city--name">${placeName}</a>
      <p class="city--time">${new Date().getHours()}</p>
      </div>
      <div class="city--conditions"> 
      <span class="city--current--temp">27C</span>
      <div class="temp-low--high"> 
      <span>H:23</span>
      <span>L:10</span>
      </div>
      </div>
      </div>
      `;

      recentPlaces?.insertAdjacentHTML('beforeend', htmlStr);
    });
  }

  private static setUpdateTime(cityTag: string): void {
    const cityElement = document.querySelector(`.${cityTag}`);
    setInterval(() => {}, 1000 * 60);
  }
}

export { WeatherInfo as default };
