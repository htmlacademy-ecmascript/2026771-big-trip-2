import {createElement} from '../render.js';

function createRoutePointContainerTemplate() {
  return (
    '<li class="trip-events__item"></li>'
  );
}

export default class RoutePointContainer {
  getTemplate() {
    return createRoutePointContainerTemplate();
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
