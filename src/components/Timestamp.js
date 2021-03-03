import React from 'react';
import Text from './Text';

const Timestamp = React.memo(({ timestamp }) => (
  <Text
    color='secondary'
    size={12}
    content={new Date(timestamp).toLocaleString()}
  />
));

export default Timestamp;
