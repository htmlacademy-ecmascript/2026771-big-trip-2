import { render, replace, remove } from '../framework/render.js';
import RoutePoint from '/src/view/route-point-view.js';
import EditPoint from '/src/view/edit-point-view.js';
import { isEscape } from '../utils.js';
import { Mode, UserAction } from '../constants.js';

export default class PointPresenter {
  #routePointListElement;
  #handleDataChange;
  #handleModeChange;
  #pointComponent;
  #pointEditComponent;
  #point;
  #destinationsModel;
  #offersModel;
  #mode = Mode.DEFAULT;
  #presenter;
  #onNewPointCancel

  constructor({ routePointListElement, destinationsModel, offersModel, onDataChange, onModeChange, presenter,  onNewPointCancel }) {
    this.#routePointListElement = routePointListElement;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#presenter = presenter;
    this.#onNewPointCancel = onNewPointCancel;
  }

  init(point) {
    this.#point = point;
    const destinations = this.#destinationsModel.destinations;
    const offers = this.#offersModel.offers;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new RoutePoint({
      point: this.#point,
      destinations: destinations,
      offers: offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
      onDeleteClick: this.#handleDeleteClick,
    });

    this.#pointEditComponent = new EditPoint({
      point: this.#point,
      destinations: destinations,
      offers: offers,
      onFormSubmit: this.#handleFormSubmit,
      onRollupClick: this.#handleRollupClick
    });

    if (prevPointComponent === undefined || prevPointEditComponent === undefined) {
      render(this.#pointComponent, this.#routePointListElement);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  }

  #replaceCardToForm() {
    if (this.#onNewPointCancel) {
      this.#onNewPointCancel();
    }
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToCard() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceFormToCard();
    }
  };

  #handleEditClick = () => {
    this.#replaceCardToForm();
  };

  #handleRollupClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceFormToCard();
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({ ...this.#point, isFavorite: !this.#point.isFavorite }, UserAction.UPDATE);
  };

  #handleFormSubmit = (updatedPoint) => {
    if (updatedPoint === null) {
      this.#handleDataChange(this.#point, UserAction.DELETE);
    } else {
      this.#handleDataChange(updatedPoint, UserAction.UPDATE);
    }
    this.#replaceFormToCard();
  };

  #handleDeleteClick = () => {
    this.#handleFormSubmit(null);
  };
}

