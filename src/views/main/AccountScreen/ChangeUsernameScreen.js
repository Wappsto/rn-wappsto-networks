import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useChangeEmail from '../../../hooks/account/useChangeEmail';

const ChangeUsernameScreen = React.memo(() => {
  const { t } = useTranslation();
  const changeEmailHandler = useChangeEmail();

  return (
    <ScrollView style={[theme.common.container, theme.common.contentContainer]}>
      <Popup visible={changeEmailHandler.successVisible} onRequestClose={changeEmailHandler.hideSuccessPopup} hide={changeEmailHandler.hideSuccessPopup} hideCloseIcon>
        <Text
          size='p'
          align='center'
          content={CapitalizeFirst(t('account:registrationConfirmation'))}
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
        label={CapitalizeFirst(t('account:username'))}
        autoCapitalize='none'
        returnKeyType='next'
        value={changeEmailHandler.username}
        onBlur={changeEmailHandler.onUsernameBlur}
        onChangeText={changeEmailHandler.setUsername}
        onSubmitEditing={() => changeEmailHandler.moveToField(changeEmailHandler.passwordRef)}
        validationError={changeEmailHandler.usernameError && CapitalizeFirst(t('account:validation.username'))}
      />
      <Input
        inputRef={changeEmailHandler.passwordRef}
        label={CapitalizeFirst(t('account:password'))}
        autoCapitalize='none'
        returnKeyType='next'
        value={changeEmailHandler.password}
        onBlur={changeEmailHandler.onPasswordBlur}
        onChangeText={changeEmailHandler.setPassword}
        showPassword={changeEmailHandler.showPassword}
        secureTextEntry={!changeEmailHandler.showPassword}
        toggleShowPassword={changeEmailHandler.toggleShowPassword}
        onSubmitEditing={() => changeEmailHandler.moveToField(changeEmailHandler.newUsernameRef)}
        validationError={changeEmailHandler.passwordError && CapitalizeFirst(t('account:validation.password'))}
      />
      <Input
        inputRef={changeEmailHandler.newUsernameRef}
        label={CapitalizeFirst(t('account:newUsername'))}
        autoCapitalize='none'
        returnKeyType='next'
        value={changeEmailHandler.newUsername}
        onBlur={changeEmailHandler.onNewUsernameBlur}
        onChangeText={changeEmailHandler.setNewUsername}
        onSubmitEditing={changeEmailHandler.update}
        validationError={changeEmailHandler.newUsernameError && CapitalizeFirst(t('account:validation.username'))}
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
  );
});

ChangeUsernameScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.changeUsername')))
  };
};

export default ChangeUsernameScreen;
