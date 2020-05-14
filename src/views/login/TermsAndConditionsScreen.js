import React, { useState, useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../translations';
import theme from '../../theme/themeExport';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import Button from '../../components/Button';
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
          <Text
            content='TBD'
          />
        </ScrollView>
        <CheckBox
          checked={checked}
          onPress={toggleChecked}
          text={CapitalizeFirst(t('account:readAndAcceptTerms'))}
        />
        <Button
          disabled={!checked}
          color={checked ? 'primary' : 'disabled'}
          onPress={navigateToRegisterScreen}
          text={CapitalizeFirst(t('account:continue'))}
        />
      </View>
    </Screen>
  );
});

TermsAndConditionsScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.terms'))
  };
};

export default TermsAndConditionsScreen;
