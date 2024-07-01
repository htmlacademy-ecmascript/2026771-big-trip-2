import {POINT_COUNT} from '../constants.js';
import {getRandomPoint} from '../mocks/route-point-mock.js';
import {destinationMock} from '../mocks/destination-mock.js';
import {offersMock} from '../mocks/offers-mock.js';

export default class TripListModel {
  constructor() {
    this.points = [];
    this.destinations = [];
    this.offers = [];
  }

  init() {
    this.points = Array.from({ length: POINT_COUNT }, getRandomPoint);
    this.destinations = destinationMock;
    this.offers = offersMock;
  }

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }
}
