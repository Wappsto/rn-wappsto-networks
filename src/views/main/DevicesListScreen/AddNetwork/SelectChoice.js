import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import i18n, { CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const SelectChoice = React.memo(({ hide, setStep }) => {
  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(i18n.t('addDevice.title'))}</Text>
      <TouchableOpacity onPress={() => setStep(1)} style={theme.common.row}>
        <Icon name='plus-circle' size={25} style={theme.common.spaceAround}/>
        <Text style={theme.common.H5}>{CapitalizeFirst(i18n.t('addDevice.register'))}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
        <Icon name='plus-circle' size={25} style={theme.common.spaceAround}/>
        <Text style={theme.common.H5}>{CapitalizeFirst(i18n.t('addDevice.registerAndWifi'))}</Text>
      </TouchableOpacity>
    </>
  );
});

export default SelectChoice;
