import { render, replace, remove } from '../framework/render.js';
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
  #pointComponents = new Map();
  #pointEditComponents = new Map();

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
        replaceFormToCard(point);
        editingMode = false;
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const handleEditClick = () => {
      if (!editingMode) {
        editingMode = true;
        replaceCardToForm(point);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    };

    const handleFavoriteClick = (pointToUpdate) => {
      const updatedPoint = { ...pointToUpdate, isFavorite: !pointToUpdate.isFavorite };

      const index = this.#points.findIndex((p) => p.id === pointToUpdate.id);
      if (index !== -1) {
        this.#points[index] = updatedPoint;

        const oldPointComponent = this.#pointComponents.get(pointToUpdate.id);
        const oldEditComponent = this.#pointEditComponents.get(pointToUpdate.id);

        const newPointComponent = new RoutePoint({
          point: updatedPoint,
          destinations: this.#destinations,
          offers: this.#offers,
          onEditClick: handleEditClick,
          onFavoriteClick: handleFavoriteClick
        });

        const newEditComponent = new EditPoint({
          point: updatedPoint,
          destinations: this.#destinations,
          offers: this.#offers,
          onFormSubmit: () => {
            replaceFormToCard(point);
            editingMode = false;
            document.removeEventListener('keydown', escKeyDownHandler);
          }
        });

        this.#pointComponents.set(updatedPoint.id, newPointComponent);
        this.#pointEditComponents.set(updatedPoint.id, newEditComponent);

        if (oldPointComponent && oldPointComponent.element.parentElement) {
          replace(newPointComponent, oldPointComponent);
        } else if (oldEditComponent && oldEditComponent.element.parentElement) {
          replace(newEditComponent, oldEditComponent);
        }
      }
    };

    const pointComponent = new RoutePoint({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      onEditClick: handleEditClick,
      onFavoriteClick: handleFavoriteClick
    });

    this.#pointComponents.set(point.id, pointComponent);

    const pointEditComponent = new EditPoint({
      point,
      destinations: this.#destinations,
      offers: this.#offers,
      onFormSubmit: () => {
        replaceFormToCard(point);
        editingMode = false;
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    this.#pointEditComponents.set(point.id, pointEditComponent);

    const replaceCardToForm = (point) => {
      const pointComponent = this.#pointComponents.get(point.id);
      const pointEditComponent = this.#pointEditComponents.get(point.id);
      if (pointComponent && pointComponent.element.parentElement) {
        replace(pointEditComponent, pointComponent);
        const eventDetailsElements = pointEditComponent.element.querySelector('.event__details');
        render(new Offer(point, this.#offers), eventDetailsElements);
        render(new Destination(point, this.#destinations), eventDetailsElements);
      }
    };

    const replaceFormToCard = (point) => {
      const pointComponent = this.#pointComponents.get(point.id);
      const pointEditComponent = this.#pointEditComponents.get(point.id);
      if (pointEditComponent && pointEditComponent.element.parentElement) {
        const eventDetailsElements = pointEditComponent.element.querySelector('.event__details');
        while (eventDetailsElements.firstChild) {
          eventDetailsElements.removeChild(eventDetailsElements.firstChild);
        }
        replace(pointComponent, pointEditComponent);
      }
    };

    render(pointComponent, this.#routePointListElement);
  }
}









