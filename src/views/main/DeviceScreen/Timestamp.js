import React from 'react';
import {Text} from 'react-native';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';

const Timestamp = React.memo(({ timestamp }) => {
  return (
    <Text style={theme.common.timestamp}>
      {CapitalizeFirst(i18n.t('lastUpdated'))}:{' '}
      {new Date(timestamp).toLocaleString()}
    </Text>
  );
});

export default Timestamp;
