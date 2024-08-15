import Observable from '../framework/observable.js';

export default class DestinationsModel extends Observable {
  #destinations = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      this.#destinations = await this.#apiService.destinations;
      this._notify('update', this.#destinations);
    } catch (err) {
      this.#destinations = [];
      this._notify('update', this.#destinations);
    }
  }

  get destinations() {
    return this.#destinations;
  }
}
