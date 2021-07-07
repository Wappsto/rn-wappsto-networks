import React, { useCallback } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import Screen from '../../components/Screen';
import Input from '../../components/Input';
import Text from '../../components/Text';
import Button from '../../components/Button';
import RequestError from '../../components/RequestError';
import Popup from '../../components/Popup';
import PageTitle from '../../components/PageTitle';
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
    setEmailBlurred
  } = useRecoverPassword();

  const navigateToLogin = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Screen>
      <ScrollView>
        <Popup visible={(request && request.status === 'success') || false} onRequestClose={emptyFunc} hide={emptyFunc} hideCloseIcon>
          <Text
            size='p'
            content={CapitalizeFirst(t('account:forgotPasswordConfirmation'))}
          />
          <Button
            color='success'
            onPress={navigateToLogin}
            text={CapitalizeFirst(t('genericButton.ok'))}
          />
        </Popup>
        <View style={theme.common.contentContainer}>
          <Text
            size='p'
            content={CapitalizeFirst(t('account:forgotPasswordInfo'))}
          />
          <Input
            label={CapitalizeFirst(t('account:username'))}
            style={emailError && theme.common.error}
            onChangeText={setEmail}
            value={email}
            onBlur={() => setEmailBlurred(true)}
            textContentType='emailAddress'
            autoCapitalize='none'
            onSubmitEditing={recoverPassword}
            keyboardType='email-address'
            returnKeyType='done'
            disabled={loading}
            validationError={emailError && CapitalizeFirst(t('account:validation.username'))}
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
            text={CapitalizeFirst(t('genericButton.send'))}
          />
        </View>
      </ScrollView>
    </Screen>
  );
});

RecoverScreen.navigationOptions = () => {
  return {
    ...theme.headerStyle,
    title: <PageTitle title='account:recoverPassword' />
  };
};

export default RecoverScreen;
