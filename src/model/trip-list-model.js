import {POINT_COUNT} from '../constants.js';
import {getRandomPoint} from '../mocks/route-point-mock.js';
import {destinationMock} from '../mocks/destination-mock.js';
import {offersMock} from '../mocks/offers-mock.js';

export default class TripListModel {
  #points = [];
  #destinations = [];
  #offers = [];

  init() {
    this.#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
    this.#destinations = destinationMock;
    this.#offers = offersMock;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }
}
