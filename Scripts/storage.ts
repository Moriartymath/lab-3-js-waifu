class StoragePlaces {
  private static places: Array<string> = [];

  static setItem(placeName: string): void {
    const storedValue = localStorage.getItem('places');
    if (storedValue !== null) this.places = JSON.parse(storedValue);

    if (!this.places.includes(placeName)) this.places.push(placeName);
    localStorage.setItem('places', JSON.stringify(this.places));
  }

  static getItem(placeName: string): Array<string> | null {
    const storedValue: string | null = localStorage.getItem('places');

    return storedValue && JSON.parse(storedValue);
  }

  static clear(): void {
    localStorage.clear();
  }

  static getAllPlaces(): Array<string> {
    const allPlaces = localStorage.getItem('places');
    return allPlaces ? JSON.parse(allPlaces) : [];
  }
}

export { StoragePlaces as default };
