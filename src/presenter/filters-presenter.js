import Filter from '../view/list-filter-view.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilterPresenter {
  #filterContentBlock = null;
  #filterModel = null;
  #filterComponent = null;
  #tripListModel = null;
  #onFilterChange;

  constructor({ filterContentBlock, filterModel, tripListModel, onFilterChange }) {
    this.#filterContentBlock = filterContentBlock;
    this.#filterModel = filterModel;
    this.#tripListModel = tripListModel;
    this.#onFilterChange = onFilterChange;
    this.#filterModel.addObserver(this.#handleModelEvent.bind(this));
  }

  init() {
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filter({
      points: this.#tripListModel.points,
      currentFilter: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContentBlock);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleFilterChange = (filter) => {
    this.#onFilterChange(filter);
  };

  #handleModelEvent = () => {
    this.init();
  };
}


