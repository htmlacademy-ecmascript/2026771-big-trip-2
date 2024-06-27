import {getRandomArrayElement, getRandomNumber} from '../utils.js';
import {POINTTYPES, AMSTERDAMFOTO, BARSELONAFOTO, MADRIDFOTO, DENHAAGFOTO, ROMEFOTO, BERLINFOTO, VENICEFOTO, SOCHIFOTO, HELSINKIFOTO, MOSKOWFOTO } from '../mock/constants.js';

const MaxPrice = 2000;
const MinPrice = 15;

const taxi = {
  'Upgrade to a business class': 50,
  'Choose the radio station': 10,
  'Choose temperature': 5,
  "Drive quickly, I'm in a hurry": 20,
  'Drive slowly': 15
};

const bus = {
  'Order meal': 15,
  'Choose seats': 10
};

const train = {
  'Book a taxi at the arrival point': 30,
  'Order a breakfast': 20,
  'Wake up at a certain time': 10
};

const flight = {
  'Choose meal': 25,
  'Choose seats': 15,
  'Upgrade to comfort class': 100,
  'Upgrade to business class': 200,
  'Add luggage': 50,
  'Business lounge': 75
};

const checkin = {
  'Choose the time of check-in': 20,
  'Choose the time of check-out': 20,
  'Add breakfast': 30,
  'Laundry': 10,
  'Order a meal from the restaurant': 40
};

const sightseeing = {};

const ship = {
  'Choose meal': 25,
  'Choose seats': 15,
  'Upgrade to comfort class': 100,
  'Upgrade to business class': 200,
  'Add luggage': 50,
  'Business lounge': 75
};

const drive = {
  'With air conditioning': 30,
  'With automatic transmission': 40
};

const restaurant = {};

const additionalOptions = {
  taxi,
  bus,
  train,
  flight,
  'check-in': checkin,
  sightseeing,
  ship,
  drive,
  restaurant
};

const mockPoint = [
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Amsterdam',
    descriptions: '',
    cityFotos: AMSTERDAMFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.bus
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Barcelona',
    descriptions: 'Barcelona - with an embankment of a mighty river as a centre of attraction',
    cityFotos: BARSELONAFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.flight
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Madrid',
    descriptions: 'Madrid - with an embankment of a mighty river as a centre of attraction',
    cityFotos: MADRIDFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.taxi
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Den Haag',
    descriptions: 'Den Haag - a perfect place to stay with a family',
    cityFotos: DENHAAGFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.flight
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Rome',
    descriptions: 'Rome - a perfect place to stay with a family',
    cityFotos: ROMEFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.taxi
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Berlin',
    descriptions: 'Berlin - a perfect place to stay with a family',
    cityFotos: BERLINFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.checkin
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Venice',
    descriptions: 'Venice - with crowded streets',
    cityFotos: VENICEFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.drive
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Sochi',
    descriptions: 'Sochi - with crowded streets',
    cityFotos: SOCHIFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.flight
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Helsinki',
    descriptions: 'Helsinki - full of cozy canteens where you can try the best coffee in the Middle East',
    cityFotos: HELSINKIFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.drive
  },
  {
    pointTypes: getRandomArrayElement(POINTTYPES),
    cityNames: 'Moscow',
    descriptions: 'Moscow - with an embankment of a mighty river as a centre of attraction',
    cityFotos: MOSKOWFOTO,
    price: getRandomNumber(MinPrice, MaxPrice),
    options: additionalOptions.sightseeing
  }
];


function getRandomPoint() {
  return getRandomArrayElement(mockPoint);
}

export {getRandomPoint};

console.log(getRandomArrayElement(POINTTYPES))
