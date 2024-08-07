import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { calculateEventDuration } from '../utils.js';
import FilterPresenter from './filters-presenter.js';
import { MessageWithoutPoint, FiltersScheme } from '../constants.js';

export default class Presenter {
  #filterContentBlock;
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #destinationsModel;
  #offersModel;
  #filterModel;
  #pageTop = new PageTop();
  #routePointList = new RoutePointList();
  #pointPresenters = new Map();
  #currentSortType = 'day';
  #sorting = null;
  #filterPresenter = null;

  constructor({ FilterContentBlock, ContentBlock, PageTopBlock, tripListModel, destinationsModel, offersModel, filterModel }) {
    this.#filterContentBlock = FilterContentBlock;
    this.#contentBlock = ContentBlock;
    this.#pageTopBlock = PageTopBlock;
    this.#tripListModel = tripListModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#sorting = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      initialSortType: this.#currentSortType
    });

    this.#filterPresenter = new FilterPresenter({
      filterContentBlock: this.#filterContentBlock,
      tripListModel: this.#tripListModel,
      filterModel: this.#filterModel,
      onFilterChange: this.#handleFilterChange
    });

    this.#filterModel.addObserver(this.#handleFilterModelChange);
  }

  init() {
    this.#filterPresenter.init();

    const points = this.#getFilteredPoints();

    if (points.length === 0) {
      let message;
      const currentFilter = this.#filterModel.filter;

      switch (currentFilter) {
          case FiltersScheme.PAST:
              message = MessageWithoutPoint.PAST;
              break;
          case FiltersScheme.PRESENT:
              message = MessageWithoutPoint.PRESENT;
              break;
          case FiltersScheme.FUTURE:
              message = MessageWithoutPoint.FUTURE;
              break;
          default:
              message = MessageWithoutPoint.EVERYTHING;
      }

      render(new ListEmpty(message), this.#contentBlock);
      return;
  }

    render(this.#pageTop, this.#pageTopBlock, RenderPosition.AFTERBEGIN);
    render(this.#sorting, this.#contentBlock);
    render(this.#routePointList, this.#contentBlock);

    this.#updatePoints();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#updatePoints();
  };

  #handleFilterChange = (filter) => {
    this.#filterModel.setFilter(filter);
  };

  #handleFilterModelChange = () => {
    this.#currentSortType = 'day';
    this.#sorting.resetSortType();
    this.#updatePoints();
  };

  #getFilteredPoints() {
    const points = [...this.#tripListModel.points];
    const currentFilterType = this.#filterModel.filter;

    switch (currentFilterType) {
      case FiltersScheme.PAST:
        return points.filter(point => new Date(point.dateTo) < new Date());
      case FiltersScheme.PRESENT:
        return points.filter(point => new Date(point.dateFrom) <= new Date() && new Date(point.dateTo) >= new Date());
      case FiltersScheme.FUTURE:
        return points.filter(point => new Date(point.dateFrom) > new Date());
      default:
        return points;
    }
  }

  #updatePoints() {
    const points = this.#getSortedPoints();
    this.#clearPoints();
    this.#renderPoints(points);
  }

  #getSortedPoints() {
    const points = [...this.#getFilteredPoints()];

    switch (this.#currentSortType) {
      case 'price':
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case 'time':
        return points.sort((a, b) => {
          const durationA = calculateEventDuration(a.dateFrom, a.dateTo, true);
          const durationB = calculateEventDuration(b.dateFrom, b.dateTo, true);
          return durationB - durationA;
        });
      case 'day':
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      default:
        return points;
    }
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#routePointList.element.innerHTML = '';
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      routePointListElement: this.#routePointList.element,
      tripListModel: this.#tripListModel,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    this.#tripListModel.updatePoint(updatedPoint);
    this.#updatePoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}




