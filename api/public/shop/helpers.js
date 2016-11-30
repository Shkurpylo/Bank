export function hideNumber(number) {
  const stringCartNumber = number.toString();
  return '...' + stringCartNumber.slice(-4);
}
