import {createElement} from '../render.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

function createEditPointTemplate(point, destinations) {

  const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const pointDestination = destinations.find((dest)=>dest.id === point.destination);
  const {basePrice, dateFrom, dateTo, type} = point;
  const {name} = pointDestination || {};
  const pointId = point.id || 0;
  const iconSrc = type.toLowerCase();

  document.addEventListener('DOMContentLoaded', () => {
    const startTimeInput = document.getElementById(`event-start-time-${pointId}`);
    const endTimeInput = document.getElementById(`event-end-time-${pointId}`);
    const endTimePicker = flatpickr(endTimeInput, {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      minDate: startTimeInput.value,
    });

    flatpickr(startTimeInput, {
      enableTime: true,
      dateFormat: 'd/m/Y H:i',
      onClose: function(selectedDates) {

        endTimePicker.set('minDate', selectedDates[0] || null);
      }
    });
  });

  return (
    `<form class="event event--edit" action="#" method="post">
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
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
  </header>
  <section class="event__details">

  </section>
</form>`
  );
}

export default class EditPoint {
  constructor(point, destinations, offers) {
    this.point = point;
    this.destinations = destinations;
    this.offers = offers;
  }

  getTemplate() {
    return createEditPointTemplate(this.point, this.destinations, this.offers);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
