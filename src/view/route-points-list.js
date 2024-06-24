import {createElement} from '../render.js';

function createRoutePointListTemplate() {
  return (
    '<ul class="trip-events__list"></ul>'
  );
}

export default class RoutePointList {
  getTemplate() {
    return createRoutePointListTemplate();
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
