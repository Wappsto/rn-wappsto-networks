import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React from 'react';
import { useRefreshTimestamp } from 'wappsto-blanket';
import Text from './Text';

dayjs.extend(relativeTime);

const Timestamp = React.memo(({ timestamp }) => {
  const dateString = dayjs(timestamp).fromNow();
  useRefreshTimestamp(timestamp);
  return <Text color="secondary" size={12} content={dateString} />;
});

export default Timestamp;
