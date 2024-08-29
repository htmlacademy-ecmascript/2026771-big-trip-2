import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offers = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#apiService.offers;
      this._notify('update', this.#offers);
    } catch (err) {
      throw new Error('Ошибка загрузки предложения');
    }
  }
}
