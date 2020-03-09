import React from 'react';
import {Text} from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import theme from '../../../theme/themeExport';

const Timestamp = React.memo(({ timestamp }) => {
  const { t } = useTranslation();
  return (
    <Text style={theme.common.timestamp}>
      {CapitalizeFirst(t('lastUpdated'))}:{' '}
      {new Date(timestamp).toLocaleString()}
    </Text>
  );
});

export default Timestamp;
