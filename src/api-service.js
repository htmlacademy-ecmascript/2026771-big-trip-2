import ApiService from './framework/api-service.js';
import { Method } from './constants.js';

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({ url: 'points' })
      .then(ApiService.parseResponse)
      .then((points) => points.map(this.#adaptPointToClient));
  }

  get destinations() {
    return this._load({ url: 'destinations' })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({ url: 'offers' })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    try {
      const response = await this._load({
        url: `points/${point.id}`,
        method: Method.PUT,
        body: JSON.stringify(this.#adaptPointToServer(point)),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const parsedResponse = await ApiService.parseResponse(response);
      return this.#adaptPointToClient(parsedResponse);
    } catch (error) {
      throw new Error('Ошибка при обновлении точки:', error);
    }
  }

  async addPoint(point) {
    try {
      const response = await this._load({
        url: 'points',
        method: Method.POST,
        body: JSON.stringify(this.#adaptPointToServer(point)),
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      const parsedResponse = await ApiService.parseResponse(response);
      return this.#adaptPointToClient(parsedResponse);
    } catch (error) {
      throw new Error('Ошибка при добавлении точки:', error);
    }
  }

  async deletePoint(point) {
    try {
      await this._load({
        url: `points/${point}`,
        method: Method.DELETE,
      });
    } catch (error) {
      throw new Error('Ошибка при удалении точки:', error);
    }
  }

  #adaptPointToClient(point) {
    return {
      id: point.id,
      /* eslint-disable camelcase */
      basePrice: point.base_price,
      dateFrom: point.date_from,
      dateTo: point.date_to,
      isFavorite: point.is_favorite,
      /* eslint-enable camelcase */
      destination: point.destination,
      offers: point.offers,
      type: point.type,
    };
  }

  #adaptPointToServer(point) {
    return {
      id: point.id,
      /* eslint-disable camelcase */
      base_price: point.basePrice,
      date_from: point.dateFrom,
      date_to: point.dateTo,
      is_favorite: point.isFavorite,
      /* eslint-enable camelcase */
      destination: point.destination,
      offers: point.offers,
      type: point.type,
    };
  }
}
