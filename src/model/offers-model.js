import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      this.#offers = await this.#apiService.offers;
      this._notify('update', this.#offers);
    } catch (err) {
      throw new Error('False load offers');
    }
  }

  get offers() {
    return this.#offers;
  }
}
