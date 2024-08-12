import Observable from '../framework/observable.js';

export default class TripListModel extends Observable {
  #points = [];
  #apiService = null;

  constructor({ apiService }) {
    super();
    this.#apiService = apiService;
  }

  async init() {
    try {
      this.#points = await this.#apiService.points;
      this._notify('update', this.#points);
    } catch (err) {

      this.#points = [];
      this._notify('update', this.#points);
    }
  }

  get points() {
    return this.#points;
  }

  setPoints(points) {
    this.#points = points;
    this._notify('update', this.#points);
  }

  addPoint(point) {
    this.#points = [point, ...this.#points];
    this._notify('update', this.#points);
  }

  async updatePoint(updatedPoint) {
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

      if (index !== -1) {
        this.#points[index] = response;
        this._notify('update', response);
      }
    } catch (error) {
      throw new Error('False update point');
    }
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
    this._notify('update', this.#points);
  }
}
