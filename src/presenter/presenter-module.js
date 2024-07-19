import { MessageWithoutPoint } from '../constants.js';
import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointContainer from '/src/view/route-point-container-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition } from '../framework/render.js';
import PointsPresenter from './points-presenter-module.js';

export default class Presenter {
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #pageTop = new PageTop();
  #sorting = new Sorting();
  #routePointContainer = new RoutePointContainer();
  #routePointList = new RoutePointList();
  #pointsPresenter;

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

    this.#pointsPresenter = new PointsPresenter({
      points,
      destinations,
      offers,
      routePointListElement: this.#routePointList.element
    });

    this.#pointsPresenter.init();
  }
}
