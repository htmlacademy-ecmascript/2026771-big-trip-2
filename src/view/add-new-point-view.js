import AbstractView from '../framework/view/abstract-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import Offer from '/src/view/offer-view.js';
import Destination from '/src/view/destination-view.js';
import { formatDateToISOString } from '../utils.js';
import { POINT_TYPES } from '../constants.js';

function createNewPointTemplate(point, destinations, destinationTemplate, offerTemplate) {
  const pointDestination = destinations.find((dest) => dest.id === point.destination);
  const { basePrice, dateFrom, dateTo, type } = point;
  const { name } = pointDestination || {};
  const pointId = point.id || 0;
  const iconSrc = type.toLowerCase();

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
        </div><div class="event__field-group  event__field-group--destination">
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
          <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${dateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${dateTo}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      <section class="event__details">
        ${offerTemplate || '<p>No offers available</p>'}
        ${destinationTemplate || ''}
      </section>
    </form>
    </li>`
  );
}

export default class NewPointView extends AbstractView {
  #destinations;
  #offers;
  #handleFormSubmit = null;
  #handleFormCancel = null;
  #point;

  constructor({ point, destinations, offers, onSave, onCancel }) {
    super();
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleFormSubmit = onSave;
    this.#handleFormCancel = onCancel;
    this.#point = point;
    this.restoreHandlers();
    this.#initFlatpickr();
  }

  get template() {
    const destinationView = new Destination(this.#point, this.#destinations);
    const destinationTemplate = destinationView.template;
    const offerView = new Offer(this.#point, this.#offers);
    const offerTemplate = offerView.template;
    return createNewPointTemplate(this.#point, this.#destinations, destinationTemplate, offerTemplate);
  }

  updateOffers(newOffers) {
    this.#offers = newOffers;
    this.element.innerHTML = this.template;
    this.restoreHandlers();
  }

  updateButtonText(text) {
    const saveButton = this.element.querySelector('.event__save-btn');
    if (saveButton) {
      saveButton.textContent = text;
    }
  }

  restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#cancelClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => input.addEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
  }

  removeHandlers() {

    this.element.querySelector('.event__save-btn').removeEventListener('click', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn').removeEventListener('click', this.#cancelClickHandler);
    this.element.querySelectorAll('.event__type-input').forEach((input) => input.removeEventListener('change', this.#typeChangeHandler));
    this.element.querySelector('.event__input--destination').removeEventListener('input', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').removeEventListener('input', this.#priceInputHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();

    this.removeHandlers();
    const startDateInput = this.element.querySelector('.event__input--time[name="event-start-time"]').value;
    const endDateInput = this.element.querySelector('.event__input--time[name="event-end-time"]').value;
    const selectedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked')).map((checkbox) => checkbox.id);
    const destinationInput = this.element.querySelector('.event__input--destination').value;
    const destination = this.#destinations.find((dest) => dest.name === destinationInput);
    const basePrice = parseInt(this.element.querySelector('.event__input--price').value, 10) || 0;
    const timeZone = (new Date().toISOString().slice(-4));

    if (!startDateInput || !endDateInput || !destination || basePrice <= 0) {
      this.shake();
      return;
    }

    const updatedPoint = {
      ...this.#point,
      dateFrom: formatDateToISOString(startDateInput, timeZone),
      dateTo: formatDateToISOString(endDateInput, timeZone),
      offers: selectedOffers,
      destination: destination.id,
      basePrice: basePrice
    };

    this.#handleFormSubmit(updatedPoint);
  };

  #typeChangeHandler = (evt) => {
    const type = evt.target.value;
    const offerData = this.#offers.find((offer) => offer.type === type);
    const newOffers = offerData ? offerData.offers : [];

    this.#point = {
      ...this.#point,
      type,
      offers: newOffers,
    };

    this.element.innerHTML = this.template;
    this.restoreHandlers();
    this.#initFlatpickr();
  };

  #destinationChangeHandler = (evt) => {
    const destinationName = evt.target.value;
    const destination = this.#destinations.find((dest) => dest.name === destinationName);

    this.#point = {
      ...this.#point,
      destination: (!destination) ? null : destination.id,
    };

    this.element.innerHTML = this.template;
    this.restoreHandlers();
    this.#initFlatpickr();
  };

  #priceInputHandler = (evt) => {
    const input = evt.target;
    input.value = input.value.replace(/[^\d]/g, '');
    this.#point = {
      ...this.#point,
      basePrice: parseInt(evt.target.value, 10) || 0,
    };
  };

  #cancelClickHandler = (evt) => {
    evt.preventDefault();
    if (this.#handleFormCancel) {
      this.#handleFormCancel();
    }
  };

  #initFlatpickr() {
    const startTimeInput = this.element.querySelector('.event__input--time[name="event-start-time"]');
    const endTimeInput = this.element.querySelector('.event__input--time[name="event-end-time"]');

    if (!startTimeInput || !endTimeInput) {
      return;
    }

    const endTimePicker = flatpickr(endTimeInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      minDate: startTimeInput.value,
      // eslint-disable-next-line camelcase
      time_24hr: true,
    });

    flatpickr(startTimeInput, {
      enableTime: true,
      dateFormat: 'd/m/y H:i',
      // eslint-disable-next-line camelcase
      time_24hr: true,
      onClose: function(selectedDates) {
        endTimePicker.set('minDate', selectedDates[0] || null);
      }
    });
  }
}


