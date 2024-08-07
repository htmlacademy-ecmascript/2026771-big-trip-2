const POINT_COUNT = 10;

const MaxPrice = 2000;
const MinPrice = 15;

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const MessageWithoutPoint = {
  'EVERYTHING': 'Click New Event to create your first point',
  'PAST': 'There are no past events now',
  'PRESENT': 'There are no present events now',
  'FUTURE': 'There are no future events now',
};

const types = ['taxi', 'bus', 'train', 'flight', 'drive', 'check-in'];
const destinationsID = ['cfe416cq-10xa-ye10-8077-2fs9a01edcaa', 'cfe416cq-10xa-ye10-8077-2fs9a01edcas', 'cfe416cq-10xa-ye10-8077-2fs9a01edcad', 'cfe416cq-10xa-ye10-8077-2fs9a01edcaf'];
const offersID = [
  'b4c3e4e6-9053-42ce-b747-e281314baa31',
  'b4c3e4e6-9053-42ce-b747-e281314baa32',
  'b4c3e4e6-9053-42ce-b747-e281314baa33',
  'b4c3e4e6-9053-42ce-b747-e281314baa51',
  'b4c3e4e6-9053-42ce-b747-e281314baa52',
  'b4c3e4e6-9053-42ce-b747-e281314baa53',
  'b4c3e4e6-9053-42ce-b747-e281314baa61',
  'b4c3e4e6-9053-42ce-b747-e281314baa62',
  'b4c3e4e6-9053-42ce-b747-e281314baa63',
  'b4c3e4e6-9053-42ce-b747-e281314baa71',
  'b4c3e4e6-9053-42ce-b747-e281314baa72',
  'b4c3e4e6-9053-42ce-b747-e281314baa81',
  'b4c3e4e6-9053-42ce-b747-e281314baa82',
  'b4c3e4e6-9053-42ce-b747-e281314baa91',
  'b4c3e4e6-9053-42ce-b747-e281314baa92',
  'b4c3e4e6-9053-42ce-b747-e281314bab71',
  'b4c3e4e6-9053-42ce-b747-e281314bab72'
];

const FiltersScheme = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

const FilterTypes = Object.values(FiltersScheme);
const SORT_TYPES = [
  { type: 'day', active: 'checked' },
  { type: 'event', active: 'disabled' },
  { type: 'time' },
  { type: 'price' },
  { type: 'offer', active: 'disabled' }
];

const UserAction = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  ADD: 'ADD',
};


export { POINT_COUNT, MessageWithoutPoint, FilterTypes, MaxPrice, MinPrice, destinationsID, offersID, types, Mode, SORT_TYPES, FiltersScheme, UserAction };
