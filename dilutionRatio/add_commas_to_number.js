export const addCommasToNumber = (numStr) => {
  const num = Number(numStr.replace(/,/g, ''));
  return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}