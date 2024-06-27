import Filter from './view/list-filter.js';
import {render} from './render.js';
import Presenter from './view/presenter-module.js';
import TripListModel from './model/trip-list-model.js';

const sectionContentElement = document.querySelector('.trip-events');
const newPageTopElement = document.querySelector('.trip-main');
const filtersContainer = newPageTopElement.querySelector('.trip-controls__filters');
const tripListModel = new TripListModel();
const newPresenter = new Presenter({ContentBlock: sectionContentElement, PageTopBlock: newPageTopElement, tripListModel});

render(new Filter(), filtersContainer);

newPresenter.init();

