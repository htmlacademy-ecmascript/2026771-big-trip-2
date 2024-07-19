import { render, RenderPosition, replace } from '../framework/render.js';
import RoutePoint from '/src/view/route-point-view.js';
import Offer from '/src/view/offer-view.js';
import Destination from '/src/view/destination-view.js';
import EditPoint from '/src/view/edit-point-view.js';
import { isEscape } from '../utils.js';

let editingMode = false;

export default class PointsPresenter {
  #points;
  #destinations;
  #offers;
  #routePointListElement;

  constructor({ points, destinations, offers, routePointListElement }) {
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#routePointListElement = routePointListElement;
  }

  init() {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
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
      destinations: this.#destinations,
      offers: this.#offers,
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
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: () => {
        replaceFormToCard();
        editingMode = false;
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    const replaceCardToForm = () => {
      replace(pointEditComponent, pointComponent);
      const eventDetailsElements = document.querySelector('.event__details');
      render(new Offer(point, this.#offers), eventDetailsElements);
      render(new Destination(point, this.#destinations), eventDetailsElements);
    };

    const replaceFormToCard = () => {
      const eventDetailsElements = document.querySelector('.event__details');
      while (eventDetailsElements.firstChild) {
        eventDetailsElements.removeChild(eventDetailsElements.firstChild);
      }
      replace(pointComponent, pointEditComponent);
    };

    render(pointComponent, this.#routePointListElement);
  }
}
