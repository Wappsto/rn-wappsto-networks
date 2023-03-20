export const MAX_POINTS = 1000;

export const TYPES = ['pointBased', 'timeBased'];

export const TIME_OPTIONS = [
  { number: 15, time: 'minute' },
  { number: 1, time: 'hour' },
  { number: 6, time: 'hour' },
  { number: 1, time: 'day' },
  { number: 1, time: 'week' },
  { number: 1, time: 'month' },
];

export const POINT_OPTIONS = [10, 25, 50, 100];

export const OPERATIONS = [
  'none',
  'avg',
  'sum',
  'count',
  'max',
  'min',
  'stddev',
  'variance',
  'geometric_mean',
  'arbitrary',
  'sqrdiff',
];

export const GROUP_BY = [
  'microsecond',
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
];
