import Filter from './view/list-filter-view.js';
import {render} from './framework/render.js';
import Presenter from './view/presenter-module.js';
import TripListModel from './model/trip-list-model.js';

const sectionContentElement = document.querySelector('.trip-events');
const newPageTopElement = document.querySelector('.trip-main');
const filtersContainer = newPageTopElement.querySelector('.trip-controls__filters');
const tripListModel = new TripListModel();
tripListModel.init();

const newPresenter = new Presenter({ContentBlock: sectionContentElement, PageTopBlock: newPageTopElement, tripListModel: tripListModel});

render(new Filter(), filtersContainer);

newPresenter.init();
