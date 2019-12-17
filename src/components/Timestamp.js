import React from 'react';
import {Text} from 'react-native';
import useRefreshTimestamp from 'wappsto-blanket/hooks/useRefreshTimestamp';
import i18n, { CapitalizeFirst } from '../translations';

const fromNow = (timestamp) => {
  let current = Date.now();
  let previous = new Date(timestamp);
  previous = previous.getTime();

  let msPerMinute = 60 * 1000;
  let msPerHour = msPerMinute * 60;
  let msPerDay = msPerHour * 24;
  let msPerMonth = msPerDay * 30;
  let msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + CapitalizeFirst(i18n.t('secondsAgo'));
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + CapitalizeFirst(i18n.t('minutesAgo'));
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + CapitalizeFirst(i18n.t('hoursAgo'));
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + CapitalizeFirst(i18n.t('daysAgo'));
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + CapitalizeFirst(i18n.t('monthsAgo'));
  } else {
    return Math.round(elapsed / msPerYear) + CapitalizeFirst(i18n.t('yearsAgo'));
  }
}
const Timestamp = React.memo(({ time }) => {
  useRefreshTimestamp(time);
  return (
    <Text>{fromNow(time)}</Text>
  );
});

export default Timestamp;
