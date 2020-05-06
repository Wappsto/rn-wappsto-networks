import React from 'react';
import Text from '../../../components/Text';
import { useTranslation, CapitalizeFirst } from '../../../translations';

const Timestamp = React.memo(({ timestamp }) => {
  const { t } = useTranslation();
  return (
    <Text
      color='secondary'
      size={12}
      content={CapitalizeFirst(t('lastUpdated'))  + ': ' + new Date(timestamp).toLocaleString()}
    />
  );
});

export default Timestamp;
