import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import Text from '../../../../components/Text';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  list: {
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    marginBottom: 3
  }
});

const SelectChoice = React.memo(({ hide, setStep }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text
        size='h3'
        content={CapitalizeFirst(t('onboarding.registrationTitle'))}
      />
      <View style={styles.list}>
        <TouchableOpacity onPress={() => setStep(1)} style={theme.common.row}>
          <Icon name='plus-circle' size={20} color={theme.variables.textColor} style={theme.common.spaceAround}/>
          <Text
            style={styles.text}
            content={CapitalizeFirst(t('onboarding.option.register'))}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
          <Icon name='wifi' size={20}  color={theme.variables.textColor} style={theme.common.spaceAround}/>
          <Text
            style={styles.text}
            content={CapitalizeFirst(t('onboarding.option.registerAndSetupWifi'))}
          />
        </TouchableOpacity>
      </View>
      <Text
        size='h3'
        content={CapitalizeFirst(t('onboarding.configurationTitle'))}
        color='disabled'
      />
      <View style={styles.list}>
        <TouchableOpacity onPress={() => setStep(2)} style={theme.common.row}>
          <Icon name='wifi' size={20} color={theme.variables.disabled} style={theme.common.spaceAround}/>
          <Text
            style={styles.text}
            content={CapitalizeFirst(t('onboarding.option.setupWifi'))}
            color='disabled'
            />
        </TouchableOpacity>
      </View>
    </>
  );
});

export default SelectChoice;
