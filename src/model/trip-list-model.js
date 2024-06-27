import {getRandomPoint} from '../mock/route-point-mock.js';

const POINT_COUNT = 10;

export default class TripListModel {
  points = Array.from({length: POINT_COUNT}, getRandomPoint);

  getPoints() {
    return this.points;
  }
}
