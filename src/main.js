import Filter from './view/list-filter.js';
import {render} from './render.js';
import Presenter from './view/presenter-module.js';

const sectionContentElement = document.querySelector('.trip-events');
const newPageTopElement = document.querySelector('.trip-main');
const filtersContainer = newPageTopElement.querySelector('.trip-controls__filters');
const newPresenter = new Presenter({ContentBlock: sectionContentElement, PageTopBlock: newPageTopElement});

render(new Filter(), filtersContainer);

newPresenter.init();
