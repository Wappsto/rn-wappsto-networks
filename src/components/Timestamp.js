import moment from 'moment/moment';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { useRefreshTimestamp } from 'wappsto-blanket';
import Text from './Text';

// dayjs.extend(relativeTime);

const Timestamp = ({ timestamp }) => {
  // const dateString = dayjs(timestamp).fromNow();
  const dateString = moment(timestamp).fromNow();
  useRefreshTimestamp(timestamp);
  return <Text color="secondary" size={12} content={dateString} />;
};

Timestamp.displayName = 'Timestamp';
export default Timestamp;
