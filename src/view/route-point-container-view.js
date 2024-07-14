import AbstractView from '../framework/view/abstract-view.js';

function createRoutePointContainerTemplate() {
  return (
    '<li class="trip-events__item"></li>'
  );
}

export default class RoutePointContainer extends AbstractView {
  get template() {
    return createRoutePointContainerTemplate();
  }
}
