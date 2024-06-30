import {createElement} from '../render.js';

function createDestinationTemplate(point, destinations) {

  const pointDestination = destinations.find((dest)=>dest.id === point.destination);

  if (pointDestination) {
    const { description, pictures } = pointDestination;

    return `
      <section class="event__section event__section--destination">
        <h3 class="event__section-title event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        <div class="event__photos-container">
        <div class="event__photos-tape">
        ${pictures && pictures.length > 0
          ? pictures.map((picture) => `
        <img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')
          : `<div></div>`}
        </div>
      </div>
      </section>`;
  } else {
    return `<section class="event__section event__section--destination"></section>`;
  }
}


export default class Destination {

  constructor(point, destinations) {
    this.destinations = destinations;
    this.point = point;
  }

  getTemplate() {
    return createDestinationTemplate(this.point, this.destinations);
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
