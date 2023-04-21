import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import Screen from '../../components/Screen';
import Text from '../../components/Text';
import Button from '../../components/Button';
import Input from '../../components/Input';
import RequestError from '../../components/RequestError';
import Popup from '../../components/Popup';
import theme from '../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../translations';
import useChangeUserDetails from '../../hooks/account/useChangeUserDetails';

const ChangeUserDetailsScreen = React.memo(() => {
  const { t } = useTranslation();
  const userDetails = useChangeUserDetails();

  return (
    <Screen>
      <ScrollView style={theme.common.contentContainer}>
        <Popup
          visible={userDetails.successVisible}
          onRequestClose={userDetails.hideSuccessPopup}
          hide={userDetails.hideSuccessPopup}
          hideCloseIcon>
          <Text
            size="p"
            align="center"
            content={CapitalizeFirst(t('account:changeUserDetailsConfirmation'))}
          />
          <Button
            color="success"
            onPress={userDetails.hideSuccessPopup}
            text={CapitalizeFirst(t('genericButton.ok'))}
          />
        </Popup>
        <Input
          value={userDetails.firstname}
          label={CapitalizeFirst(t('account:firstName'))}
          returnKeyType="next"
          onChangeText={userDetails.setFirstname}
          onSubmitEditing={() => userDetails.moveToField(userDetails.lastnameRef)}
        />
        <Input
          inputRef={userDetails.lastnameRef}
          value={userDetails.lastname}
          label={CapitalizeFirst(t('account:lastName'))}
          returnKeyType="next"
          onChangeText={userDetails.setLastname}
          onSubmitEditing={() => userDetails.moveToField(userDetails.nicknameRef)}
        />
        <Input
          inputRef={userDetails.nicknameRef}
          value={userDetails.nickname}
          label={CapitalizeFirst(t('account:nickname'))}
          returnKeyType="next"
          onChangeText={userDetails.setNickname}
          onSubmitEditing={() => userDetails.moveToField(userDetails.emailRef)}
        />
        <Input
          inputRef={userDetails.emailRef}
          value={userDetails.email}
          label={CapitalizeFirst(t('account:email'))}
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={userDetails.setEmail}
          onSubmitEditing={() => userDetails.moveToField(userDetails.phoneRef)}
          onBlur={userDetails.onEmailBlur}
          validationError={
            userDetails.emailError && CapitalizeFirst(t('account:validation.username'))
          }
        />
        <Input
          inputRef={userDetails.phoneRef}
          value={userDetails.phone}
          label={CapitalizeFirst(t('account:phone'))}
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={userDetails.setPhone}
          onSubmitEditing={userDetails.update}
        />
        {userDetails.loading && (
          <ActivityIndicator size="large" color={theme.variables.spinnerColor} />
        )}
        <Button
          display="block"
          text={CapitalizeFirst(t('genericButton.save'))}
          disabled={!userDetails.canUpdate}
          onPress={userDetails.update}
        />
        <RequestError request={userDetails.request} />
      </ScrollView>
    </Screen>
  );
});

export default ChangeUserDetailsScreen;
