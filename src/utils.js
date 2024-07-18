function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(MinPrice, MaxPrice) {
  return Math.floor(Math.random() * (MaxPrice - MinPrice + 1)) + MinPrice;
}

function calculateEventDuration(dateFrom, dateTo) {
  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const duration = end - start;

  const totalMinutes = Math.floor(duration / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  let result = '';

  if (days > 0) {
    result += `${days}D `;
  }

  if (days > 0 || hours > 0) {
    result += `${hours.toString().padStart(2, '0')}H `;
  }

  result += `${minutes.toString().padStart(2, '0')}M`;

  return result.trim();
}

const isEscape = (evt) => evt.key === 'Escape';

function countPointsByFilter(points) {
  const currentDate = new Date();

  return {
    EVERYTHING: points.length,
    FUTURE: points.filter((point) => new Date(point.dateFrom) > currentDate).length,
    PRESENT: points.filter((point) => new Date(point.dateFrom) <= currentDate && new Date(point.dateTo) >= currentDate).length,
    PAST: points.filter((point) => new Date(point.dateTo) < currentDate).length,
  };
}


export {getRandomArrayElement, getRandomNumber, calculateEventDuration, isEscape, countPointsByFilter};
