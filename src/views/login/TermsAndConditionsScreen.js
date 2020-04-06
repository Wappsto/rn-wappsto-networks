import React, { useState, useCallback } from 'react';
import { Text, ScrollView, TouchableOpacity, View } from 'react-native';
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../translations';
import theme from '../../theme/themeExport';
import Screen from '../../components/Screen';
import CheckBox from '../../components/CheckBox';

const TermsAndConditionsScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const [ checked, setChecked ] = useState(false);

  const toggleChecked = useCallback(() => {
    setChecked(c => !c);
  }, []);

  const navigateToRegisterScreen = useCallback(() => {
    navigation.navigate('RegisterScreen');
  }, [navigation]);

  return (
    <Screen>
      <View style={[theme.common.container, theme.common.spaceAround]}>
        <ScrollView>
          <Text>TBD</Text>
        </ScrollView>
        <CheckBox
          checked={checked}
          onPress={toggleChecked}
          text={CapitalizeFirst(t('loginAndRegistration.button.readAndAcceptTerms'))}
        />
        <TouchableOpacity
          disabled={!checked}
          style={[theme.common.button, checked ? null : theme.common.disabled]}
          onPress={navigateToRegisterScreen}
        >
          <Text style={theme.common.buttonText}>{CapitalizeFirst(t('loginAndRegistration.button.continue'))}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
});

TermsAndConditionsScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('loginAndRegistration.termsTitle'))
  };
};

export default TermsAndConditionsScreen;
