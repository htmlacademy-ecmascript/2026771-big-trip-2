const POINT_COUNT = 10;

const MessageWithoutPoint = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

const FilterTypes = Object.keys(MessageWithoutPoint)

export { POINT_COUNT, MessageWithoutPoint, FilterTypes };
