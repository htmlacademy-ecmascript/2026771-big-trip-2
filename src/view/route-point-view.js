import AbstractView from '../framework/view/abstract-view.js';
import {calculateEventDuration} from '../utils.js';
import { Calendar } from '../constants.js';

function createRoutePointTemplate(point, destinations, offers) {
  const {basePrice, dateFrom, dateTo, isFavorite, type} = point;
  const iconSrc = type.toLowerCase();
  const typeOffers = offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase()).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointDestination = destinations.find((dest)=>dest.id === point.destination);
  const offersMarkup = pointOffers.length > 0 ? `
<h4 class="visually-hidden">Offers:</h4>
<ul class="event__selected-offers">
  ${pointOffers.map((offer) => (
    `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  )).join('')}
</ul>` : '';
  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${new Date(dateFrom).toLocaleDateString(Calendar.LOCALE, {day: Calendar.FORMAT, month: Calendar.MONTH}).toUpperCase()}
      </time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${iconSrc}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${pointDestination?.name || ''}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${dateFrom.slice(11, 16)}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${dateTo.slice(11, 16)}</time>
        </p>
        <p class="event__duration">${calculateEventDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>

      ${offersMarkup}

      <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>>`
  );
}

export default class RoutePoint extends AbstractView {
  #point;
  #offers;
  #destinations;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, destinations, offers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn')
      .addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createRoutePointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick(this.#point);
  };
}
