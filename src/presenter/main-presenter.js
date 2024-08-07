import PageTop from '/src/view/page-top-view.js';
import Sorting from '/src/view/list-sort-view.js';
import RoutePointList from '/src/view/route-points-list-view.js';
import ListEmpty from '/src/view/list-empty-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { calculateEventDuration, isEscape } from '../utils.js';
import FilterPresenter from './filters-presenter.js';
import { MessageWithoutPoint, FiltersScheme, UserAction } from '../constants.js';
import NewPointView from '/src/view/add-new-point-view.js';

export default class Presenter {
  #filterContentBlock;
  #contentBlock;
  #pageTopBlock;
  #tripListModel;
  #destinationsModel;
  #offersModel;
  #filterModel;
  #pageTop = new PageTop();
  #routePointList = new RoutePointList();
  #pointPresenters = new Map();
  #currentSortType = 'day';
  #sorting = null;
  #filterPresenter = null;
  #creatingPointComponent = null;
  #newEventButton = null;
  #isCreatingNewPoint = false;

  constructor({ FilterContentBlock, ContentBlock, PageTopBlock, tripListModel, destinationsModel, offersModel, filterModel }) {
    this.#filterContentBlock = FilterContentBlock;
    this.#contentBlock = ContentBlock;
    this.#pageTopBlock = PageTopBlock;
    this.#tripListModel = tripListModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;

    this.#sorting = new Sorting({
      onSortTypeChange: this.#handleSortTypeChange,
      initialSortType: this.#currentSortType
    });

    this.#filterPresenter = new FilterPresenter({
      filterContentBlock: this.#filterContentBlock,
      tripListModel: this.#tripListModel,
      filterModel: this.#filterModel,
      onFilterChange: this.#handleFilterChange
    });

    this.#filterModel.addObserver(this.#handleFilterModelChange);
  }

  init() {
    this.#filterPresenter.init();

    render(this.#pageTop, this.#pageTopBlock, RenderPosition.AFTERBEGIN);
    render(this.#sorting, this.#contentBlock);
    render(this.#routePointList, this.#contentBlock);

    this.#updatePoints();
    this.#renderNewPointButton();
  }

  isCreatingNewPoint() {
    return this.#isCreatingNewPoint;
  }

  #renderNewPointButton() {
    this.#newEventButton = document.querySelector('.trip-main__event-add-btn');
    this.#newEventButton.addEventListener('click', this.#handleNewPointButtonClick);
  }

  #handleNewPointButtonClick = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#filterModel.setFilter(FiltersScheme.EVERYTHING);
    this.#currentSortType = 'day';
    this.#sorting.resetSortType();

    if (this.#creatingPointComponent) {
      this.#creatingPointComponent.element.remove();
      this.#creatingPointComponent = null;
    }

    const newPointBlock = document.querySelector('.trip-events__trip-sort');

    const defaultType = 'flight';
    const defaultOffers = this.#offersModel.offers.find((offer) => offer.type === 'flight').offers;
    this.#creatingPointComponent = new NewPointView({
      point: {
        id: Date.now(),
        type: defaultType,
        offers: defaultOffers,
        destination: null,
        dateFrom: '',
        dateTo: '',
        basePrice: 0
      },
      destinations: this.#destinationsModel.destinations,
      offers: this.#offersModel.offers,
      onSave: this.#handleNewPointSave,
      onCancel: this.#handleNewPointCancel,
      onTypeChange: this.#handleTypeChange,
    });

    render(this.#creatingPointComponent, newPointBlock);
    document.addEventListener('keydown', this.#escNewPointKeyDownHandler);
    this.#newEventButton.disabled = true;
    this.#isCreatingNewPoint = true;
  };

  #handleNewPointSave = (point) => {
    this.#newEventButton.disabled = false;
    this.#isCreatingNewPoint = false;
    this.#tripListModel.addPoint(point);
    this.#updatePoints();
    remove(this.#creatingPointComponent);
    document.removeEventListener('keydown', this.#escNewPointKeyDownHandler);
  };

  #escNewPointKeyDownHandler = (evt) => {
    if (isEscape(evt)) {
      this.#handleNewPointCancel();
    }
  };

  #handleNewPointCancel = () => {
    this.#newEventButton.disabled = false;
    this.#isCreatingNewPoint = false;
    remove(this.#creatingPointComponent);
    document.removeEventListener('keydown', this.#escNewPointKeyDownHandler);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#updatePoints();
  };

  #handleFilterChange = (filter) => {
    this.#filterModel.setFilter(filter);
  };

  #clearEmptyMessage() {
    const emptyMessageElement = this.#contentBlock.querySelector('.trip-events__msg');
    if (emptyMessageElement) {
      emptyMessageElement.remove();
    }
  }

  #handleFilterModelChange = () => {
    this.#currentSortType = 'day';
    this.#sorting.resetSortType();
    this.#clearEmptyMessage();
    this.#updatePoints();
  };

  #handleTypeChange = (newType) => {

    const offerData = this.#offersModel.offers.find((offer) => offer.type === newType);

    if (!offerData) {
      return;
    }

    const updatedOffers = offerData.offers;

    if (this.#creatingPointComponent) {
      this.#creatingPointComponent.updateOffers(updatedOffers);
    }
  };

  #getFilteredPoints() {
    const points = [...this.#tripListModel.points];
    const currentFilterType = this.#filterModel.filter;

    switch (currentFilterType) {
      case FiltersScheme.PAST:
        return points.filter((point) => new Date(point.dateTo) < new Date());
      case FiltersScheme.PRESENT:
        return points.filter((point) => new Date(point.dateFrom) <= new Date() && new Date(point.dateTo) >= new Date());
      case FiltersScheme.FUTURE:
        return points.filter((point) => new Date(point.dateFrom) > new Date());
      default:
        return points;
    }
  }

  #updatePoints() {
    const points = this.#getSortedPoints();
    this.#clearPoints();

    if (points.length === 0) {
      let message;
      const currentFilter = this.#filterModel.filter;

      switch (currentFilter) {
        case FiltersScheme.PAST:
          message = MessageWithoutPoint.PAST;
          break;
        case FiltersScheme.PRESENT:
          message = MessageWithoutPoint.PRESENT;
          break;
        case FiltersScheme.FUTURE:
          message = MessageWithoutPoint.FUTURE;
          break;
        default:
          message = MessageWithoutPoint.EVERYTHING;
      }

      render(new ListEmpty(message), this.#contentBlock);
    } else {
      this.#renderPoints(points);
    }
  }

  #getSortedPoints() {
    const points = [...this.#getFilteredPoints()];

    switch (this.#currentSortType) {
      case 'price':
        return points.sort((a, b) => b.basePrice - a.basePrice);
      case 'time':
        return points.sort((a, b) => {
          const durationA = calculateEventDuration(a.dateFrom, a.dateTo, true);
          const durationB = calculateEventDuration(b.dateFrom, b.dateTo, true);
          return durationB - durationA;
        });
      case 'day':
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
      default:
        return points;
    }
  }

  #clearPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#routePointList.element.innerHTML = '';
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      routePointListElement: this.#routePointList.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange,
      presenter: this
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #handlePointChange = (updatedPoint, actionType) => {
    switch (actionType) {
      case UserAction.DELETE:
        this.#tripListModel.deletePoint(updatedPoint.id);
        break;
      case UserAction.UPDATE:
        this.#tripListModel.updatePoint(updatedPoint);
        break;
      case UserAction.ADD:
        this.#tripListModel.addPoint(updatedPoint);
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
    this.#updatePoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
