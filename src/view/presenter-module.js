import PageTop from './page-top-view.js';
import Sorting from './list-sort-view.js';
import NewPoint from './add-new-point-view.js';
import RoutePointContainer from './route-point-container-view.js';
import RoutePointList from './route-points-list-view.js';
import RoutePoint from './route-point-view.js';
import Offer from './offer-view.js';
import Destination from './destination-view.js';
import EditPoint from './edit-point-view.js';
import {render, RenderPosition} from '../render.js';

export default class Presenter {

  constructor({ContentBlock, PageTopBlock, tripListModel}) {
    this.ContentBlock = ContentBlock;
    this.PageTopBlock = PageTopBlock;
    this.tripListModel = tripListModel;
  }

  init() {
    const points = this.tripListModel.getPoints();
    const destinations = this.tripListModel.getDestinations();
    const offers = this.tripListModel.getOffers();

    render(new PageTop(), this.PageTopBlock, RenderPosition.AFTERBEGIN);
    render(new Sorting(), this.ContentBlock);

    const routePointList = new RoutePointList();
    render(routePointList, this.ContentBlock);

    const routePointContainer = new RoutePointContainer();
    render(routePointContainer, routePointList.getElement());


    const tripfieldComponent = new NewPoint(points[0], destinations, offers);
    render(tripfieldComponent, routePointContainer.getElement());

    const EventDetailsElement = document.querySelector('.event__details');
    render(new Offer(points[0], offers), EventDetailsElement);
    const destinationComponent = new Destination(points[0], destinations);
    render(destinationComponent, EventDetailsElement);

    render(new EditPoint( points[0], destinations, offers ), routePointContainer.getElement());

    const EventDetailsElements = document.querySelectorAll('.event__details');
    const secondEventDetailsElement = EventDetailsElements[1];
    render(new Offer(points[0], offers), secondEventDetailsElement);
    render(new Destination(points[0], destinations), secondEventDetailsElement);

    points.forEach((point) => {
      const routePoint = new RoutePoint({ point, destinations, offers });
      render(routePoint, routePointList.getElement());
    });
  }
}

