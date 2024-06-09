import StoragePlaces from './storage';

const recentPlaces = document.querySelector('.recent-locations');

class WeatherInfo {
  static displayUI(): void {
    this.diplayRecentPlaces();
  }

  private static diplayRecentPlaces(): void {
    const allPlaces = StoragePlaces.getAllPlaces();

    allPlaces.slice(-4).forEach(placeName => {
      const htmlStr = `
      <div class="place ${placeName.toLowerCase()}--place"><a>${placeName}</a></div>
      `;

      recentPlaces?.insertAdjacentHTML('beforeend', htmlStr);
    });
  }
}

export { WeatherInfo as default };
