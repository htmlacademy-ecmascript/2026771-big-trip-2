import Observable from '../framework/observable.js';
import { FilterTypes } from '../constants.js';

export default class FilterModel extends Observable {
  #filter = FilterTypes[0];

  get filter() {
    return this.#filter;
  }

  setFilter(filter) {
    if (this.#filter === filter) {
      return;
    }
    this.#filter = filter;
    this._notify('change', this.#filter);
  }
}
