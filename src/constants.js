const COUNT_CITIES = 3;

const MILLISECONDS_PER_MINUTE = 60000;

const MINUTES_PER_HOUR = 60;

const HOURS_PER_DAY = 24;

const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const SERVER_URL = 'https://22.objects.htmlacademy.pro/big-trip';

const AUTHORIZATION = 'Basic 0000';

const SORT_TYPES = [
  { type: 'day', active: 'checked' },
  { type: 'event', active: 'disabled' },
  { type: 'time' },
  { type: 'price' },
  { type: 'offer', active: 'disabled' }
];

const TimeLimit = {
  LOWER_LIMIT: 0,
  UPPER_LIMIT: 300,
};

const ButtonText = {
  SAVE: 'Save',
  DELETE: 'Delete',
  SAVING: 'Saving...',
  DELETING: 'Deleting...'
};

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const Calendar = {
  LOCALE: 'en-US',
  FORMAT: '2-digit',
  MONTH: 'short'
};

const MessageWithoutPoint = {
  'EVERYTHING': 'Click New Event to create your first point',
  'PAST': 'There are no past events now',
  'PRESENT': 'There are no present events now',
  'FUTURE': 'There are no future events now',
};

const FiltersScheme = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const FilterTypes = Object.values(FiltersScheme);

const UserAction = {
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  ADD: 'ADD',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export { MessageWithoutPoint, FilterTypes, POINT_TYPES, Mode, SORT_TYPES, FiltersScheme, UserAction, Method, SERVER_URL, AUTHORIZATION, COUNT_CITIES, Calendar, ButtonText, TimeLimit, MILLISECONDS_PER_MINUTE, MINUTES_PER_HOUR, HOURS_PER_DAY };
