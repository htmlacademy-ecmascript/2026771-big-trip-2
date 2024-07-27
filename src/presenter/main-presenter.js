import { MessageWithoutPoint } from '../constants.js';
import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { calculateEventDuration } from '../utils.js';

export default class Presenter {
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #pageTop = new PageTop();
  #routePointList = new RoutePointList();
  #pointPresenters = new Map();
  #currentSortType = 'day';
  #sorting = null;

  constructor({ ContentBlock, PageTopBlock, tripListModel }) {
    this.#contentBlock = ContentBlock;
    this.#pageTopBlock = PageTopBlock;
    this.#tripListModel = tripListModel;

    this.#sorting = new Sorting({ onSortTypeChange: this.#handleSortTypeChange });
  }

  init() {
    const points = this.#tripListModel.points;

    if (points.length === 0) {
      render(new ListEmpty(MessageWithoutPoint.EVERYTHING), this.#contentBlock);
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

  #updatePoints() {
    const points = this.#getSortedPoints();
    this.#clearPoints();
    this.#renderPoints(points, this.#tripListModel.destinations, this.#tripListModel.offers);

  }

  #getSortedPoints() {
    const points = [...this.#tripListModel.points];
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

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => this.#renderPoint(point, destinations, offers));
  }

  #renderPoint(point, destinations, offers) {
    const pointPresenter = new PointPresenter({
      routePointListElement: this.#routePointList.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point, destinations, offers);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint) => {
    const points = this.#tripListModel.points;
    const index = points.findIndex((point) => point.id === updatedPoint.id);

    if (!~index) {
      return;
    }

    points[index] = updatedPoint;
    this.#updatePoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}


