import Filter from './view/list-filter-view.js';
import {render} from './framework/render.js';
import Presenter from './presenter/main-presenter.js';
import TripListModel from './model/trip-list-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';

const tripListModel = new TripListModel();
tripListModel.init();

const destinationsModel = new DestinationsModel();
destinationsModel.init();

const offersModel = new OffersModel();
offersModel.init();

const sectionContentElement = document.querySelector('.trip-events');
const newPageTopElement = document.querySelector('.trip-main');
const filtersContainer = newPageTopElement.querySelector('.trip-controls__filters');

const newPresenter = new Presenter({
  ContentBlock: sectionContentElement,
  PageTopBlock: newPageTopElement,
  tripListModel: tripListModel,
  destinationsModel: destinationsModel,
  offersModel: offersModel
});

render(new Filter(tripListModel.points), filtersContainer);

newPresenter.init();
