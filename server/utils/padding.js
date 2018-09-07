const padding = (number) => {
  if (Number.isNaN(Number(number)) || Number(number) < 1) return -1;
  if (`${number}`.length > 1 || number > 10) {
    return `${number}`;
  }
  return `0${number}`;
};

export default padding;
