function makeTodaysDate() {
  const now = new Date(Date.now());
  const [year, month, day] = [
    now.getFullYear(),
    now.getMonth(),
    now.getDay(),
  ];

  const padding = (num) => {
    const padded = num > 10 ? `${num}` : `0${num}`;
    return padded;
  };

  return `${year}-${padding(month)}-${padding(day)}`;
}

export default makeTodaysDate;
