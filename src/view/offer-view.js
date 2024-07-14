import AbstractView from '../framework/view/abstract-view.js';

function createOfferTemplate(point, offers) {

  const typeOffersObj = offers.find((offer) => offer.type === point.type);
  const typeOffers = typeOffersObj ? typeOffersObj.offers : [];
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointId = point.id;

  if (typeOffers.length === 0) {
    return `<section class="event__section event__section--offers">
  </section>`;
  }

  return (
    `<section class="event__section event__section--offers">
      <h3 class="event__section-title event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${typeOffers.map((typeOffer) => (
      `<div class="event__offer-selector">
            <input class="event__offer-checkbox visually-hidden" id="event-offer-${typeOffer.title.split(' ').join('_')}-${pointId}" type="checkbox" name="event-offer-${typeOffer.title.split(' ').join('_')}" ${pointOffers.some((offer) => offer.id === typeOffer.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${typeOffer.title.split(' ').join('_')}-${pointId}">
              <span class="event__offer-title">${typeOffer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${typeOffer.price}</span>
            </label>
          </div>`
    )).join('')}
      </div>
    </section>`
  );
}
export default class Offer extends AbstractView {
  #point;
  #offers;

  constructor(point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template() {
    return createOfferTemplate(this.#point, this.#offers);
  }
}
