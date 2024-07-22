import { getRandomArrayElement, getRandomNumber } from '../utils.js';
import { MaxPrice, MinPrice, destinationsID, offersID, types } from '../constants.js';

function generateRandomDate(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString();
}

function getRandomOffers() {
  const offerCount = getRandomNumber(0, 5);
  return getRandomArrayElement(offersID, offerCount);
}

function generateRandomRoutePoint() {
  const type = getRandomArrayElement(types);
  const destination = getRandomArrayElement(destinationsID);
  const offers = getRandomOffers();

  return {
    id: `f4b62099-293f-4c3d-a702-94eec4a2808${getRandomNumber(MinPrice, MaxPrice)}`,
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: generateRandomDate('2019-01-01T00:00:00.000Z', '2025-12-31T23:59:59.999Z'),
    dateTo: generateRandomDate('2019-01-02T00:00:00.000Z', '2026-01-01T23:59:59.999Z'),
    destination: destination.join(),
    isFavorite: Math.random() > 0.5,
    offers: offers.join(),
    type: type.join()
  };
}

export function getRandomPoint() {
  return generateRandomRoutePoint();
}



