import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const SelectChoice = React.memo(({ hide, setStep }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(t('addDevice.title'))}</Text>
      <TouchableOpacity onPress={() => setStep(1)} style={theme.common.row}>
        <Icon name='plus-circle' size={25} style={theme.common.spaceAround}/>
        <Text style={theme.common.H5}>{CapitalizeFirst(t('addDevice.register'))}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
        <Icon name='plus-circle' size={25} style={theme.common.spaceAround}/>
        <Text style={theme.common.H5}>{CapitalizeFirst(t('addDevice.registerAndWifi'))}</Text>
      </TouchableOpacity>
    </>
  );
});

export default SelectChoice;
