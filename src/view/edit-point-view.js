import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Offer from '/src/view/offer-view.js';
import Destination from '/src/view/destination-view.js';
import { formatDateToISOString } from '../utils.js';
import { POINT_TYPES, MILLISECONDS_PER_MINUTE, MINUTES_PER_HOUR } from '../constants.js';

const offsetTime = new Date().getTimezoneOffset() / MINUTES_PER_HOUR;

function createEditPointTemplate(point, destinations, destinationTemplate, offerTemplate) {
  const pointDestination = destinations.find((dest)=>dest.id === point.destination);
  const {basePrice, dateFrom, dateTo, type} = point;
  const {name} = pointDestination || {};
  const pointId = point.id || 0;
  const iconSrc = type.toLowerCase();
  const localFromDate = new Date(new Date(dateFrom).getTime() + offsetTime * MINUTES_PER_HOUR * MILLISECONDS_PER_MINUTE).toUTCString();
  const localToDate = new Date(new Date(dateTo).getTime() + offsetTime * MINUTES_PER_HOUR * MILLISECONDS_PER_MINUTE).toUTCString();

  return (
    `<li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${iconSrc}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${POINT_TYPES.map((pointType) => (
      `<div class="event__type-item">
                  <input id="event-type-${pointType}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-${pointId}">${pointType[0].toUpperCase()}${pointType.slice(1)}</label>
                </div>`
    )).join('')}

            </fieldset>
          </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointId}">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${name || ''}" list="destination-list-${pointId}">
          <datalist id="destination-list-${pointId}">
          ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${localFromDate}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${localToDate}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>

      <section class="event__details">
        ${offerTemplate || ''}
        ${destinationTemplate || ''}
      </section>
    </form>
  </li>`
  );
}

export default class EditPoint extends AbstractStatefulView {
  #destinations;
  #offers;
  #onFormSubmit = null;
  #onRollupClick = null;

  constructor({ point, destinations, offers, onFormSubmit, onRollupClick }) {
    super();
    this._state = EditPoint.parsePointToState(point);
    this.#destinations = destinations;
    this.#offers = offers;
    this.#onFormSubmit = onFormSubmit;
    this.#onRollupClick = onRollupClick;

    this._restoreHandlers();
    this.#initFlatpickr();
  }

  get template() {
    const destinationView = new Destination(this._state, this.#destinations);
    const destinationTemplate = destinationView.template;
    const offerView = new Offer(this._state, this.#offers);
    const offerTemplate = offerView.template;

    return createEditPointTemplate(this._state, this.#destinations, destinationTemplate, offerTemplate);
  }

  reset(point) {
    this.updateElement(
      EditPoint.parsePointToState(point),
    );
    this.#initFlatpickr();
  }

  updateButtonText(text) {
    const saveButtonElement = this.element.querySelector('.event__save-btn');
    if (saveButtonElement) {
      saveButtonElement.textContent = text;
    }
  }

  deleteButtonText(text) {
    const deleteButtonElement = this.element.querySelector('.event__reset-btn');
    if (deleteButtonElement) {
      deleteButtonElement.textContent = text;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  }

  _removeEventListeners() {
    this.element.querySelector('.event__save-btn').removeEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').removeEventListener('click', this.#deleteClickHandler);
    this.element.querySelector('.event__rollup-btn').removeEventListener('click', this.#rollupClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => input.removeEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').removeEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').removeEventListener('input', this.#priceInputHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    const startDateInputElement = this.element.querySelector('.event__input--time[name="event-start-time"]').value;
    const endDateInputElement = this.element.querySelector('.event__input--time[name="event-end-time"]').value;
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'))
      .map((checkbox) => checkbox.id);
    const destinationInputElement = this.element.querySelector('.event__input--destination').value;
    const destination = this.#destinations.find((dest) => dest.name === destinationInputElement);
    const basePrice = parseInt(this.element.querySelector('.event__input--price').value, 10) || 0;

    if (!startDateInputElement || !endDateInputElement || !destination || basePrice <= 0) {
      this.shake();
      return;
    }

    this.updateElement({
      dateFrom: formatDateToISOString(startDateInputElement),
      dateTo: formatDateToISOString(endDateInputElement),
      offers: selectedOffers,
      destination: destination.id,
      basePrice: basePrice
    });
    this.#onFormSubmit(EditPoint.parseStateToPoint(this._state));
    this._removeEventListeners();
  };


  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#onRollupClick();
    this.#initFlatpickr();
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    const newOffers = this.#offers.find((offer) => offer.type === type).offers;

    this.updateElement({
      type,
      offers: newOffers,
    });
    this.#initFlatpickr();
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    const destination = this.#destinations.find((dest) => dest.name === destinationName);

    if (destination) {
      this.updateElement({
        destination: destination.id,
        description: destination.description,
        photos: destination.photos,
      });
      this.#initFlatpickr();
    }
  };

  #priceInputHandler = (evt) => {
    const input = evt.target;
    input.value = input.value.replace(/[^\d]/g, '');
    evt.preventDefault();
    this._setState({
      basePrice: parseInt(evt.target.value, 10) || 0,
    });
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(null);
  };


  #initFlatpickr() {
    const startTimeInputElement = this.element.querySelector(`#event-start-time-${this._state.id}`);
    const endTimeInputElement = this.element.querySelector(`#event-end-time-${this._state.id}`);

    const endTimePicker = flatpickr(endTimeInputElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      minDate: startTimeInputElement.value,
      // eslint-disable-next-line camelcase
      time_24hr: true,
    });

    flatpickr(startTimeInputElement, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onClose: function(selectedDates) {
        endTimePicker.set('minDate', selectedDates[0] || null);
      }
    });
  }

  static parsePointToState(point) {
    return {
      ...point,
      isDestination: point.destination !== null,
      offers: point.offers || [],
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    if (!point.isDestination) {
      point.destination = null;
    }

    return point;
  }
}
