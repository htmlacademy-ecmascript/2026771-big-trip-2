import PageTop from './page-top.js';
import Sorting from './list-sort.js';
import NewPoint from './add-new-point.js';
import RoutePointContainer from './route-point-container.js';
import RoutePointList from './route-points-list.js';
import RoutePoint from './route-point.js';
import Offer from './offer.js';
import Destination from './destination.js';
import FotoDestination from './foto-destination.js';
import EditPoint from './edit-point.js';
import {render, RenderPosition} from '../render.js';

export default class Presenter {

  constructor({ContentBlock, PageTopBlock}) {
    this.ContentBlock = ContentBlock;
    this.PageTopBlock = PageTopBlock;
  }

  init() {
    render(new PageTop(), this.PageTopBlock, RenderPosition.AFTERBEGIN);
    render(new Sorting(), this.ContentBlock);

    const routePointList = new RoutePointList();
    render(routePointList, this.ContentBlock);

    const routePointContainer = new RoutePointContainer();
    render(routePointContainer, routePointList.getElement());

    const tripfieldComponent = new NewPoint();
    render(tripfieldComponent, routePointContainer.getElement());

    const EventDetailsElement = document.querySelector('.event__details');
    render(new Offer(), EventDetailsElement);
    const destinationComponent = new Destination();
    render(destinationComponent, EventDetailsElement);
    render(new FotoDestination(), EventDetailsElement);

    const editPointComponent = new EditPoint();
    render(editPointComponent, routePointContainer.getElement());

    const EventDetailsElements = document.querySelectorAll('.event__details');
    const secondEventDetailsElement = EventDetailsElements[1];
    render(new Offer(), secondEventDetailsElement);
    render(new Destination(), secondEventDetailsElement);


    for (let i = 0; i < 3; i++) {
      render(new RoutePoint(), routePointList.getElement());
    }


  }
}
