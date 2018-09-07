import padding from './padding';

function makeTodaysDate() {
  const now = new Date(Date.now());
  const [year, month, day] = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ];

  return `${year}-${padding(month)}-${padding(day)}`;
}

export default makeTodaysDate;
