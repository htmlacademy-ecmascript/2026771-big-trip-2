import AbstractView from '../framework/view/abstract-view.js';
import { countPointsByFilter } from '../utils.js';
import { FilterTypes } from '../constants.js';

function createFilterTemplate(pointsCount) {

  let filtersView = '';

  for (let i = 0; i < FilterTypes.length; i++) {
    const isChecked = FilterTypes[i] === 'EVERYTHING' ? 'checked' : '';
    const isDisabled = pointsCount[FilterTypes[i]] === 0 ? 'disabled' : '';

    filtersView += `
      <div class="trip-filters__filter">
        <input id="filter-${FilterTypes[i].toLowerCase()}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${FilterTypes[i].toLowerCase()}" ${isChecked} ${isDisabled}>
        <label class="trip-filters__filter-label" for="filter-${FilterTypes[i].toLowerCase()}">${FilterTypes[i].charAt(0) + FilterTypes[i].slice(1).toLowerCase()}</label>
      </div>
    `;
  }

  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersView}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
}

export default class Filter extends AbstractView {
  #pointsCount;

  constructor(points) {
    super();
    this.#pointsCount = countPointsByFilter(points);
  }

  get template() {
    return createFilterTemplate(this.#pointsCount);
  }
}
