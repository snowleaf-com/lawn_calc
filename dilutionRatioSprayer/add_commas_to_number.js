export const addCommasToNumber = (numStr) => {
  const num = Number(numStr.replace(/,/g, ''));
  return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}