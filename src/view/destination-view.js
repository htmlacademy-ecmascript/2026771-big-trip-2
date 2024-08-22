import AbstractView from '../framework/view/abstract-view.js';

function createDestinationTemplate(point, destinations) {
  const pointDestination = destinations.find((dest) => dest.id === point.destination);

  if (!pointDestination) {
    return '';
  }

  if (!pointDestination.pictures[0]) {
    return '';
  }

  const { description, pictures } = pointDestination;

  return `
    <section class="event__section event__section--destination">
      <h3 class="event__section-title event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${pictures && pictures.length > 0
    ? pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')
    : ''}
        </div>
      </div>
    </section>`;
}

export default class Destination extends AbstractView {
  #point;
  #destinations;

  constructor(point, destinations) {
    super();
    this.#destinations = destinations;
    this.#point = point;
  }

  get template() {
    return createDestinationTemplate(this.#point, this.#destinations);
  }
}
