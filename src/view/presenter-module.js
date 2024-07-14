import PageTop from './page-top-view.js';
import Sorting from './list-sort-view.js';
import NewPoint from './add-new-point-view.js';
import RoutePointContainer from './route-point-container-view.js';
import RoutePointList from './route-points-list-view.js';
import RoutePoint from './route-point-view.js';
import Offer from './offer-view.js';
import Destination from './destination-view.js';
import EditPoint from './edit-point-view.js';
import {render, RenderPosition, replace} from '../framework/render.js';
import { isEscape } from '../utils.js';

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
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new RoutePoint({
      point,
      destinations,
      offers,
      onEditClick: () => {
        replaceCardToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditPoint({
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        replaceFormToCard();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const replaceCardToForm = () => {
      replace(pointEditComponent, pointComponent);
      const EventDetailsElements = document.querySelector('.event__details');
      render(new Offer(point, offers), EventDetailsElements);
      render(new Destination(point, destinations), EventDetailsElements);
    };

    const replaceFormToCard = () => {
      const EventDetailsElements = document.querySelector('.event__details');
      while (EventDetailsElements.firstChild) {
        EventDetailsElements.removeChild(EventDetailsElements.firstChild);
      }
      replace(pointComponent, pointEditComponent);
    };

    render(pointComponent, this.#routePointList.element);
  }
}
