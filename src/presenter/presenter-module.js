import { MessageWithoutPoint } from '../constants.js';
import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointContainer from '/src/view/route-point-container-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import RoutePoint from '/src/view/route-point-view.js';
import Offer from '/src/view/offer-view.js';
import Destination from '/src/view/destination-view.js';
import EditPoint from '/src/view/edit-point-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition, replace } from '../framework/render.js';
import { isEscape } from '../utils.js';

let editingMode = false;

export default class Presenter {
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #pageTop = new PageTop();
  #sorting = new Sorting();
  #routePointContainer = new RoutePointContainer();
  #routePointList = new RoutePointList();


  constructor({ContentBlock, PageTopBlock, tripListModel}) {
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

    points.forEach((point) => {
      this.#routePoint(point, destinations, offers);
    });
  }

  #routePoint(point, destinations, offers) {
    const escKeyDownHandler = (evt) => {
      if (isEscape(evt)) {
        evt.preventDefault();
        replaceFormToCard();
        editingMode = false;
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new RoutePoint({
      point,
      destinations,
      offers,
      onEditClick: () => {
        if (!editingMode) {
          editingMode = true;
          replaceCardToForm();
          document.addEventListener('keydown', escKeyDownHandler);
        }
      }
    });

    const pointEditComponent = new EditPoint({
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToCard();
        editingMode = false;
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceCardToForm () {
      replace(pointEditComponent, pointComponent);
      const EventDetailsElements = document.querySelector('.event__details');
      render(new Offer(point, offers), EventDetailsElements);
      render(new Destination(point, destinations), EventDetailsElements);
    }

    function replaceFormToCard() {
      const EventDetailsElements = document.querySelector('.event__details');
      while (EventDetailsElements.firstChild) {
        EventDetailsElements.removeChild(EventDetailsElements.firstChild);
      }
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#routePointList.element);
  }
}
