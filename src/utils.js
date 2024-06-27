function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomNumber(MinPrice, MaxPrice) {
  return Math.floor(Math.random() * (MaxPrice - MinPrice + 1)) + MinPrice;
}

export {getRandomArrayElement, getRandomNumber};
