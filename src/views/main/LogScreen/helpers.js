import dayjs from 'dayjs';

const compute = ({ start, end }) => {
  if (!start || !end) {
    return;
  }
  // diff in minutes
  const diff = (end.getTime() - start.getTime()) / (1000 * 60);
  if (diff <= 60) {
    return [];
  } else if (diff <= 60 * 24) {
    return ['minute', 'avg'];
  } else if (diff <= 60 * 24 * 7) {
    return ['hour', 'avg'];
  } else if (diff <= 60 * 24 * 30 * 18) {
    return ['day', 'avg'];
  } else {
    return ['week', 'avg'];
  }
};

export const getDateOptions = (time, number = 1, arrowClick = 0, autoCompute) => {
  const options = { end: new Date(), start: new Date() };
  switch (time) {
    case 'minute':
      options.end.setMinutes(options.start.getMinutes() - number * arrowClick);
      options.start.setMinutes(options.start.getMinutes() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'hour':
      options.end.setHours(options.start.getHours() - number * arrowClick);
      options.start.setHours(options.start.getHours() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'day':
      options.end.setDate(options.start.getDate() - number * arrowClick);
      options.start.setDate(options.start.getDate() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'week':
      options.end.setDate(options.start.getDate() - 7 * number * arrowClick);
      options.start.setDate(options.start.getDate() - 7 * number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'month':
      options.end.setMonth(options.start.getMonth() - number * arrowClick);
      options.start.setMonth(options.start.getMonth() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    default:
      break;
  }
  options.start.setMilliseconds(0);
  options.end.setMilliseconds(0);
  options.order = 'descending';
  return options;
};

export const getXValueOptions = (number, arrowClick = 0, autoCompute) => {
  const now = dayjs();
  const start = now.subtract(10, 'year').format();
  const end = now.toISOString();
  const options = {
    start,
    end,
    limit: number,
    offset: number * arrowClick,
    value: { number },
    type: 'pointBased',
    order: 'descending',
  };
  if (autoCompute) {
    options.operation = undefined;
    options.group_by = undefined;
  }
  return options;
};
