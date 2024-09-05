import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
      this._notify('update', this.#destinations);
    } catch (err) {
      throw new Error('Ошибка загрузки направлений');
    }
  }
}
