import Observable from '../framework/observable.js';
import { POINT_COUNT } from '../constants.js';
import { getRandomPoint } from '../mocks/route-point-mock.js';

export default class TripListModel extends Observable {
  #points = [];

  init() {
    this.#points = Array.from({ length: POINT_COUNT }, getRandomPoint);
    this._notify('update', this.#points);
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

  updatePoint(updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index !== -1) {
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify('update', this.#points);
    }
  }

  deletePoint(pointId) {
    this.#points = this.#points.filter((point) => point.id !== pointId);
    this._notify('update', this.#points);
  }
}
