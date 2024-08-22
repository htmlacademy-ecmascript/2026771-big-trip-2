import AbstractView from '../framework/view/abstract-view.js';

function createPageTopTemplate({ title, dates, cost }) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${title}</h1>
        <p class="trip-info__dates">${dates}</p>
      </div>
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
      </p>
    </section>`
  );
}

export default class PageTop extends AbstractView {
  constructor({ title = '', dates = '', cost = 0 } = {}) {
    super();
    this._title = title;
    this._dates = dates;
    this._cost = cost;
  }

  get template() {
    return createPageTopTemplate({ title: this._title, dates: this._dates, cost: this._cost });
  }

  update({ title, dates, cost }) {
    this._title = title;
    this._dates = dates;
    this._cost = cost;

    this.element.innerHTML = createPageTopTemplate({ title: this._title, dates: this._dates, cost: this._cost });
  }
}
