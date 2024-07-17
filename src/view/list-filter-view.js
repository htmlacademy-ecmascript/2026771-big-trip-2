import AbstractView from '../framework/view/abstract-view.js';
import { countPointsByFilter } from '../utils.js';

function createFilterTemplate(pointsCount) {
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="everything" checked ${pointsCount.EVERYTHING === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="future" ${pointsCount.FUTURE === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-present" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="present" ${pointsCount.PRESENT === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-present">Present</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="past" ${pointsCount.PAST === 0 ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-past">Past</label>
      </div>

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
