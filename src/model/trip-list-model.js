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

  async addPoint(point) {
    try {
      const response = await this.#apiService.addPoint(point);
      this.#points = [response, ...this.#points];
      this._notify('update', this.#points);
    } catch (error) {
      throw new Error('Ошибка добавления точки');
    }
  }

  async updatePoint(updatedPoint) {
    try {
      const response = await this.#apiService.updatePoint(updatedPoint);
      const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

      if (index !== -1) {
        this.#points[index] = response;
        this._notify('update', this.#points);
      }
    } catch (error) {
      throw new Error('Ошибка обновления точки');
    }
  }

  async deletePoint(pointId) {
    try {
      await this.#apiService.deletePoint(pointId);
      this.#points = this.#points.filter((point) => point.id !== pointId);
      this._notify('update', this.#points);
    } catch (error) {
      throw new Error('Ошибка удаления точки');
    }
  }
}
