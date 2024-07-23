import { MessageWithoutPoint } from '../constants.js';
import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointContainer from '/src/view/route-point-container-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class Presenter {
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #pageTop = new PageTop();
  #sorting = new Sorting();
  #routePointContainer = new RoutePointContainer();
  #routePointList = new RoutePointList();
  #pointPresenters = new Map();

  constructor({ ContentBlock, PageTopBlock, tripListModel }) {
    this.#contentBlock = ContentBlock;
    this.#pageTopBlock = PageTopBlock;
    this.#tripListModel = tripListModel;
  }

  init() {
    const points = this.#tripListModel.points;
    const destinations = this.#tripListModel.destinations;
    const offers = this.#tripListModel.offers;

    if (points.length === 0) {
      render(new ListEmpty(MessageWithoutPoint.EVERYTHING), this.#contentBlock);
      return;
    }

    render(this.#pageTop, this.#pageTopBlock, RenderPosition.AFTERBEGIN);
    render(this.#sorting, this.#contentBlock);
    render(this.#routePointList, this.#contentBlock);
    render(this.#routePointContainer, this.#routePointList.element);

    this.#renderPoints(points, destinations, offers);
  }

  #renderPoints(points, destinations, offers) {
    points.forEach((point) => {
      this.#renderPoint(point, destinations, offers);
    });
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

    if (index === -1) {
      return;
    }

    points[index] = updatedPoint;

    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#tripListModel.destinations, this.#tripListModel.offers);
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}


