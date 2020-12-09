import React, { useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native'
import { useTranslation, CapitalizeEach, CapitalizeFirst } from '../../translations';
import theme from '../../theme/themeExport';
import Screen from '../../components/Screen';
import Button from '../../components/Button';
import CheckBox from '../../components/CheckBox';
import { WebView } from 'react-native-webview';

const TermsAndConditionsScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const [ checked, setChecked ] = useState(false);
  const hideAccept = route.params?.hideAccept;
  const toggleChecked = useCallback(() => {
    setChecked(c => !c);
  }, []);

  const navigateToRegisterScreen = useCallback(() => {
    navigation.navigate('RegisterScreen');
  }, [navigation]);

  return (
    <Screen>
      <View style={theme.common.container}>
        <WebView source={{ uri: 'http://docs.google.com/gview?embedded=true&url=https://www.seluxit.com/wp-content/uploads/2020/06/Cloud-Solutions-Terms-and-Conditions-Business.pdf' }}/>
        {
          !hideAccept ?
            <View style={theme.common.spaceAround}>
              <CheckBox
                checked={checked}
                onPress={toggleChecked}
                text={CapitalizeFirst(t('account:readAndAcceptTerms'))}
              />
              <Button
                disabled={!checked}
                display='block'
                color={checked ? 'primary' : 'disabled'}
                onPress={navigateToRegisterScreen}
                text={CapitalizeFirst(t('account:continue'))}
              />
            </View>
          : null
        }
      </View>
    </Screen>
  );
});

TermsAndConditionsScreen.navigationOptions = ({ t }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.terms'))
  };
};

export default TermsAndConditionsScreen;
