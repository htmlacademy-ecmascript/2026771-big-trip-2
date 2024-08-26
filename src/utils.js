const isEscape = (evt) => evt.key === 'Escape';

function calculateEventDuration(dateFrom, dateTo, forCalculation = false) {

  const start = new Date(dateFrom);
  const end = new Date(dateTo);
  const duration = end - start;

  const totalMinutes = Math.floor(duration / 60000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (forCalculation) {
    return duration;
  }

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

function formatDateToISOString(dateStr, timeZone) {
  const [day, month, yearAndTime] = dateStr.split('/');
  const [year, time] = yearAndTime.split(' ');
  const [hours, minutes] = time.split(':');
  const isoDateStr = `20${year}-${month}-${day}T${hours}:${minutes}:00.${timeZone}`;
  const date = new Date(isoDateStr);
  const formattedDateStr = date.toISOString();

  return formattedDateStr;
}

function countPointsByFilter(points) {
  const currentDate = new Date();
  return {
    everething: points.length,
    future: points.filter((point) => new Date(point.dateFrom) > currentDate).length,
    present: points.filter((point) => new Date(point.dateFrom) <= currentDate && new Date(point.dateTo) >= currentDate).length,
    past: points.filter((point) => new Date(point.dateTo) < currentDate).length,
  };
}


export { calculateEventDuration, isEscape, countPointsByFilter, formatDateToISOString };
