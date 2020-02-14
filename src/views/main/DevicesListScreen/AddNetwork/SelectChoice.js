import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';

const SelectChoice = React.memo(({ hide, setStep }) => {
  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(i18n.t('addDevice.title'))}</Text>
      <TouchableOpacity onPress={() => setStep(1)}>
        <Text>{CapitalizeFirst(i18n.t('addDevice.register'))}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(2)}>
        <Text>{CapitalizeFirst(i18n.t('addDevice.registerAndWifi'))}</Text>
      </TouchableOpacity>
    </>
  );
});

export default SelectChoice;
