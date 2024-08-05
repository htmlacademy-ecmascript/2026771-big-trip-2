import Observable from '../framework/observable.js';
import {offersMock} from '../mocks/offers-mock.js';

export default class OfferstModel extends Observable {

  #offers = [];

  init() {
    this.#offers = offersMock;

  }

  get offers() {
    return this.#offers;
  }
}
