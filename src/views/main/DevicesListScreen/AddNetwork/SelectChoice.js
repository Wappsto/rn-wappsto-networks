import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  list: {
    marginBottom: 20
  },
  text: {
    fontSize: theme.variables.h5,
    marginBottom: 3
  }
});

const SelectChoice = React.memo(({ hide, setStep }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={theme.common.H3}>{CapitalizeFirst(t('onboarding.registrationTitle'))}</Text>
      <View style={styles.list}>
        <TouchableOpacity onPress={() => setStep(1)} style={theme.common.row}>
          <Icon name='plus-circle' size={20} style={theme.common.spaceAround}/>
          <Text style={styles.text}>{CapitalizeFirst(t('onboarding.option.register'))}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
          <Icon name='wifi' size={20} style={theme.common.spaceAround}/>
          <Text style={styles.text}>{CapitalizeFirst(t('onboarding.option.registerAndSetupWifi'))}</Text>
        </TouchableOpacity>
      </View>
      <Text style={[theme.common.H3, {color: theme.variables.disabled}]}>{CapitalizeFirst(t('onboarding.configurationTitle'))}</Text>
      <View style={styles.list}>
        <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
          <Icon name='wifi' size={20} color={theme.variables.disabled} style={theme.common.spaceAround}/>
          <Text style={[styles.text, {color: theme.variables.disabled}]}>{CapitalizeFirst(t('onboarding.option.setupWifi'))}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
});

export default SelectChoice;
