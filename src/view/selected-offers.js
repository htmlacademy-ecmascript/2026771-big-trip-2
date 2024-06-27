import {createElement} from '../render.js';

function createSelectedOffersTemplate(point) {
  const {options} = point

  return (
    `<li class="event__offer">
    <span class="event__offer-title">${options}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">200</span>
  </li>`
  );
}

export default class SelectedOffers {
  constructor({point}) {
    this.point = point;
  }
  getTemplate() {
    return createSelectedOffersTemplate(this.point);
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
