import { fetchWeather } from './weather';
class Forecast {
  private static forecast: HTMLDivElement | null = document.querySelector(
    '.city-detailed-forecast'
  );
  private static locationsDiv: HTMLDivElement | null =
    document.querySelector('.recent-locations');

  static displayUI(): void {
    this.boundEventListener();
    this.exitHandler();
  }

  private static boundEventListener(): void {
    this.locationsDiv?.addEventListener(
      'click',
      function (ev: Event) {
        const target: EventTarget | null = ev.target;
        const cityDiv: HTMLElement | null = target?.closest('.place');

        if (cityDiv?.classList.contains('place')) {
          this.forecast.dataset.city = cityDiv.dataset.city;

          // if (this.forecast.classList.contains('opened')) {
          this.forecast.classList.add('opened');
          const leftInfoPanel = document.querySelector('.left-info');
          if (leftInfoPanel) leftInfoPanel.style.visibility = 'hidden';

          this.displayForecast(cityDiv.dataset.city);
          // }
        }
      }.bind(this)
    );
  }
  private static displayForecast(city: string): void {
    const cityElement: HTMLElement | null = document.querySelector(
      `.${city}--place`
    );
    console.log(cityElement);
    if (!cityElement) return;
    console.log();
    console.log('Fetched!');
    fetchWeather(14, city, undefined, cityElement);
  }

  private static exitHandler(): void {
    const exitBtn: HTMLElement | null = document.querySelector('.exit--btn');

    if (!exitBtn) return;
    const handler = function () {
      this.forecast.classList.remove('opened');
      const leftPanel = document.querySelector('.left-info');
      if (leftPanel) leftPanel.style.visibility = 'visible';
    }.bind(this);

    exitBtn.addEventListener('click', handler);
    document.body.addEventListener('keydown', ev => {
      if (ev.key === 'Escape') handler();
    });
  }
}

export { Forecast as default };
