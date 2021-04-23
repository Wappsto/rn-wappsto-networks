import React from 'react';
import Text from './Text';
import useRefreshTimestamp from 'wappsto-blanket/hooks/useRefreshTimestamp';
import moment from 'moment';

const Timestamp = React.memo(({ timestamp }) => {
  const dateString = moment(timestamp).fromNow();
  useRefreshTimestamp(timestamp);
  return (
    <Text
      color='secondary'
      size={12}
      content={dateString}
    />
  )
});

export default Timestamp;
