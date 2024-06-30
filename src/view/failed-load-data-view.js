import {createElement} from '../render.js';

function createFailedLoadDataTemplate() {
  return (
    '<p class="trip-events__msg">Failed to load latest route information</p>'
  );
}

export default class FailedLoadData {
  getTemplate() {
    return createFailedLoadDataTemplate();
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
