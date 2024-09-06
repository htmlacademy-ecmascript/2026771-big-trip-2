import AbstractView from '../framework/view/abstract-view.js';
import { countPointsByFilter } from '../utils.js';
import { FilterTypes } from '../constants.js';

function createFilterTemplate(pointsCount, currentFilter) {
  let filtersView = '';

  for (let i = 0; i < FilterTypes.length; i++) {
    const filterType = FilterTypes[i];
    const isChecked = filterType === currentFilter ? 'checked' : '';
    const isDisabled = pointsCount[filterType] === 0 ? 'disabled' : '';

    filtersView += `
      <div class="trip-filters__filter">
        <input id="filter-${filterType.toLowerCase()}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filterType.toLowerCase()}" ${isChecked} ${isDisabled}>
        <label class="trip-filters__filter-label" for="filter-${filterType.toLowerCase()}">${filterType.charAt(0) + filterType.slice(1).toLowerCase()}</label>
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
  #currentFilter;
  #onFilterChange;

  constructor({ points, currentFilter, onFilterChange }) {
    super();
    this.#pointsCount = countPointsByFilter(points);
    this.#currentFilter = currentFilter;
    this.#onFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#pointsCount, this.#currentFilter);
  }

  #filterChangeHandler = (event) => {
    if (event.target.name === 'trip-filter') {
      this.#onFilterChange(event.target.value);
    }
  };
}

