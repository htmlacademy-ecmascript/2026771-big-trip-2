import Observable from '../framework/observable.js';
import {destinationMock} from '../mocks/destination-mock.js';


export default class DestinationsModel extends Observable {

  #destinations = [];

  init() {
    this.#destinations = destinationMock;

  }

  get destinations() {
    return this.#destinations;
  }
}
