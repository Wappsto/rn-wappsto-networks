import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useChangePassword from '../../../hooks/account/useChangePassword';

const ChangePassword = React.memo(() => {
  const { t } = useTranslation();
  const changePassword = useChangePassword();

  return (
    <ScrollView style={[theme.common.container, theme.common.contentContainer]}>
      <Popup visible={changePassword.successVisible} onRequestClose={changePassword.hideSuccessPopup} hide={changePassword.hideSuccessPopup} hideCloseIcon>
        <Text
          size='p'
          align='center'
          content={CapitalizeFirst(t('account:changePasswordSuccess'))}
        />
        <Button
          color='success'
          onPress={changePassword.hideSuccessPopup}
          text={CapitalizeFirst(t('genericButton.ok'))}
        />
      </Popup>
      <Text
        size='p'
        content={CapitalizeFirst(t('account:changePasswordInfo'))}
      />
      <Input
        label={CapitalizeFirst(t('account:currentPassword'))}
        inputRef={changePassword.currentPassword.ref}
        autoCapitalize='none'
        returnKeyType='next'
        value={changePassword.currentPassword.text}
        onBlur={changePassword.currentPassword.onBlur}
        onChangeText={changePassword.currentPassword.setText}
        showPassword={changePassword.currentPassword.visible}
        secureTextEntry={!changePassword.currentPassword.visible}
        toggleShowPassword={changePassword.currentPassword.toggleVisible}
        onSubmitEditing={() => changePassword.moveToField(changePassword.newPassword.ref)}
        validationError={changePassword.currentPassword.error && CapitalizeFirst(t('account:validation.password'))}
      />
      <Input
        label={CapitalizeFirst(t('account:newPassword'))}
        inputRef={changePassword.newPassword.ref}
        autoCapitalize='none'
        returnKeyType='next'
        value={changePassword.newPassword.text}
        onBlur={changePassword.newPassword.onBlur}
        onChangeText={changePassword.newPassword.setText}
        showPassword={changePassword.newPassword.visible}
        secureTextEntry={!changePassword.newPassword.visible}
        toggleShowPassword={changePassword.newPassword.toggleVisible}
        onSubmitEditing={() => changePassword.moveToField(changePassword.repeatPassword.ref)}
        validationError={changePassword.newPassword.error && CapitalizeFirst(t('account:validation.password'))}
      />
      <Input
        label={CapitalizeFirst(t('account:repeatPassword'))}
        inputRef={changePassword.repeatPassword.ref}
        autoCapitalize='none'
        returnKeyType='next'
        value={changePassword.repeatPassword.text}
        onBlur={changePassword.repeatPassword.onBlur}
        onChangeText={changePassword.repeatPassword.setText}
        showPassword={changePassword.repeatPassword.visible}
        secureTextEntry={!changePassword.repeatPassword.visible}
        toggleShowPassword={changePassword.repeatPassword.toggleVisible}
        onSubmitEditing={changePassword.update}
        validationError={changePassword.repeatPassword.error && CapitalizeFirst(t('account:validation.password'))}
      />
      {changePassword.loading && (
        <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
      )}
      <Button
        display='block'
        text={CapitalizeFirst(t('genericButton.save'))}
        disabled={!changePassword.canUpdate}
        onPress={changePassword.update}
      />
      <RequestError request={changePassword.request} />
    </ScrollView>
  );
});

ChangePassword.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.changePassword')))
  };
};

export default ChangePassword;
