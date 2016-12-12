export function numberGenerator(type) {
  const visaId = 401997;
  const masterCardId = 551997;
  const cardId = Math.floor(Math.random() * (10000000000 - 999999999)) +
    999999999;
  if (type === 'VISA') {
    return '' + visaId + cardId;
  }
  return '' + masterCardId + cardId;

  // TODO: add Luhn algorithm
}

export function getPin() {
  return Math.floor(Math.random() * (10000 - 999)) + 999;
}

export function getCVV() {
  return Math.floor(Math.random() * (1000 - 99)) + 99;
}

export function getExplDate() {
  const now = new Date;
  now.setFullYear(now.getFullYear() + 3);
  return now;
}

export function hideHumber(number) {
  const stringCartNumber = number.toString();
  return stringCartNumber.slice(0, 4) + '........' + stringCartNumber.slice(-4);
}
