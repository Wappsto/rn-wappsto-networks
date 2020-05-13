import React, { useCallback } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Button from '../../components/Button';
import RequestError from '../../components/RequestError';
import Popup from '../../components/Popup';
import useRecoverPassword from '../../hooks/login/useRecoverPassword';
import { useTranslation, CapitalizeFirst } from '../../translations';
import theme from '../../theme/themeExport';

const emptyFunc = () => {};
const RecoverScreen = React.memo(({ navigation }) => {
  const { t } = useTranslation();
  const {
    email,
    setEmail,
    canRecoverPassword,
    recoverPassword,
    request,
    loading,
    emailError,
    setEmailBlurred,
  } = useRecoverPassword();

  const navigateToLogin = useCallback(() => {
    navigation.navigate('LoginScreen');
  }, [navigation]);

  return (
    <Screen>
      <ScrollView>
        <Popup visible={(request && request.status === 'success') || false} onRequestClose={emptyFunc} hide={emptyFunc} hideCloseIcon>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('loginAndRegistration.recoverPasswordSuccessText'))}
          />
          <Button
            color='success'
            onPress={navigateToLogin}
            text={CapitalizeFirst(t('loginAndRegistration.button.ok'))}
          />
        </Popup>
        <View style={theme.common.contentContainer}>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('loginAndRegistration.recoverPasswordText'))}
          />
          <Input
            label={CapitalizeFirst(t('loginAndRegistration.label.username'))}
            style={emailError && theme.common.error}
            onChangeText={setEmail}
            value={email}
            onBlur={() => setEmailBlurred(true)}
            textContentType='emailAddress'
            autoCapitalize='none'
            onSubmitEditing={recoverPassword}
            keyboardType='email-address'
            returnKeyType='next'
            disabled={loading}
            validationError={emailError && CapitalizeFirst(t('loginAndRegistration.validation.username'))}
          />
          {loading && (
            <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
          )}
          <RequestError request={request} />
          <Button
            disabled={!canRecoverPassword}
            color={!canRecoverPassword ? 'disabled' : 'primary'}
            onPress={recoverPassword}
            display='block'
            text={CapitalizeFirst(t('loginAndRegistration.button.recoverPassword'))}
          />
        </View>
      </ScrollView>
    </Screen>
  );
});

RecoverScreen.navigationOptions = ({ screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeFirst(t('loginAndRegistration.recoverPasswordTitle'))
  };
};

export default RecoverScreen;
