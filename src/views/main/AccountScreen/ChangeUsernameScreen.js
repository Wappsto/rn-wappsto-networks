import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import Popup from '../../../components/Popup';
import PageTitle from '../../../components/PageTitle';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useChangeEmail from '../../../hooks/account/useChangeEmail';

const ChangeUsernameScreen = React.memo(() => {
  const { t } = useTranslation();
  const changeEmailHandler = useChangeEmail();

  return (
    <Screen>
      <ScrollView style={theme.common.contentContainer}>
        <Popup visible={changeEmailHandler.successVisible} onRequestClose={changeEmailHandler.hideSuccessPopup} hide={changeEmailHandler.hideSuccessPopup} hideCloseIcon>
          <Text
            size='p'
            align='center'
            content={CapitalizeFirst(t('account:changeUsernameConfirmation'))}
          />
          <Button
            color='success'
            onPress={changeEmailHandler.hideSuccessPopup}
            text={CapitalizeFirst(t('genericButton.ok'))}
          />
        </Popup>
        <Text
          size='p'
          content={CapitalizeFirst(t('account:changeUsernameInfo'))}
        />
        <Input
          label={CapitalizeFirst(t('account:currentUsername'))}
          autoCapitalize='none'
          returnKeyType='next'
          value={changeEmailHandler.usernameField.text}
          onBlur={changeEmailHandler.usernameField.onBlur}
          onChangeText={changeEmailHandler.usernameField.setText}
          onSubmitEditing={() => changeEmailHandler.moveToField(changeEmailHandler.passwordField.ref)}
          validationError={changeEmailHandler.usernameField.error && CapitalizeFirst(t('account:validation.username'))}
        />
        <Input
          inputRef={changeEmailHandler.passwordField.ref}
          label={CapitalizeFirst(t('account:password'))}
          autoCapitalize='none'
          returnKeyType='next'
          value={changeEmailHandler.passwordField.text}
          onBlur={changeEmailHandler.passwordField.onBlur}
          onChangeText={changeEmailHandler.passwordField.setText}
          showPassword={changeEmailHandler.passwordField.visible}
          secureTextEntry={!changeEmailHandler.passwordField.visible}
          toggleShowPassword={changeEmailHandler.passwordField.toggleVisible}
          onSubmitEditing={() => changeEmailHandler.moveToField(changeEmailHandler.newUsernameField.ref)}
          validationError={changeEmailHandler.passwordField.error && CapitalizeFirst(t('account:validation.required', { field: 'password' }))}
        />
        <Input
          inputRef={changeEmailHandler.newUsernameField.ref}
          label={CapitalizeFirst(t('account:newUsername'))}
          autoCapitalize='none'
          returnKeyType='next'
          value={changeEmailHandler.newUsernameField.text}
          onBlur={changeEmailHandler.newUsernameField.onBlur}
          onChangeText={changeEmailHandler.newUsernameField.setText}
          onSubmitEditing={changeEmailHandler.update}
          validationError={changeEmailHandler.newUsernameField.error && CapitalizeFirst(t('account:validation.username'))}
        />
        {changeEmailHandler.loading && (
          <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
        )}
        <Button
          display='block'
          text={CapitalizeFirst(t('genericButton.send'))}
          disabled={!changeEmailHandler.canUpdate}
          onPress={changeEmailHandler.update}
        />
        <RequestError request={changeEmailHandler.request} />
      </ScrollView>
    </Screen>
  );
});

ChangeUsernameScreen.navigationOptions = ({ route }) => {
  return {
    ...theme.headerStyle,
    title: route.params.title || <PageTitle title='account:changeUsername' />
  };
};

export default ChangeUsernameScreen;
