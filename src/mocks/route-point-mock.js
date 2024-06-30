import {getRandomArrayElement, getRandomNumber} from '../utils.js';

const MaxPrice = 2000;
const MinPrice = 15;

export const routePointMock = [
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808f",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-08-10T23:21:00.845Z",
    dateTo: "2019-08-12T23:22:00.375Z",
    destination: "cfe416cq-10xa-ye10-8077-2fs9a01edcaa",
    isFavorite: true,
    offers: [
    "b4c3e4e6-9053-42ce-b747-e281314baa31"
    ],
    type: "taxi"
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808g",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-07-10T22:55:56.845Z",
    dateTo: "2019-07-11T17:22:13.375Z",
    destination: "cfe416cq-10xa-ye10-8077-2fs9a01edcas",
    isFavorite: false,
    offers: [],
    type: "bus"
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808h",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-07-10T05:45:16.845Z",
    dateTo: "2019-07-13T19:22:13.375Z",
    destination: '',
    isFavorite: false,
    offers: [
      "b4c3e4e6-9053-42ce-b747-e281314baa61",
      "b4c3e4e6-9053-42ce-b747-e281314baa63"
    ],
    type: "train"
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808j",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-07-11T10:55:56.845Z",
    dateTo: "2019-07-11T11:48:53.375Z",
    destination: "cfe416cq-10xa-ye10-8077-2fs9a01edcaf",
    isFavorite: true,
    offers: [
      "b4c3e4e6-9053-42ce-b747-e281314baa51",
      "b4c3e4e6-9053-42ce-b747-e281314baa53"
    ],
    type: "flight"
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808k",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-09-23T12:50:56.845Z",
    dateTo: "2019-09-24T10:10:13.375Z",
    destination: "cfe416cq-10xa-ye10-8077-2fs9a01edcaf",
    isFavorite: false,
    offers: [],
    type: "drive"
  },
  {
    id: "f4b62099-293f-4c3d-a702-94eec4a2808n",
    basePrice: getRandomNumber(MinPrice, MaxPrice),
    dateFrom: "2019-09-23T13:50:56.845Z",
    dateTo: "2019-07-24T10:15:13.375Z",
    destination: "cfe416cq-10xa-ye10-8077-2fs9a01edcaa",
    isFavorite: true,
    offers: [
      "b4c3e4e6-9053-42ce-b747-e281314baa96",
      "b4c3e4e6-9053-42ce-b747-e281314bag92"
    ],
    type: "check-in"
  }
]

  function getRandomPoint() {
    return getRandomArrayElement(routePointMock);
  }

  export {getRandomPoint};
