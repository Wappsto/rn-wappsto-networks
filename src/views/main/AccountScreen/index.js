import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import MenuButton from '../../../components/MenuButton';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import Icon from 'react-native-vector-icons/Feather';
import useUser from '../../../hooks/useUser';
import useDeleteAccount from '../../../hooks/account/useDeleteAccount';
import Popup from '../../../components/Popup';
import Input from '../../../components/Input';
import KeyboardAvoidingView from '../../../components/KeyboardAvoidingView';
import Clipboard from '@react-native-community/clipboard';

const styles = StyleSheet.create({
  item: {
    borderTopWidth: theme.variables.borderWidth,
    borderColor: theme.variables.borderColor,
    paddingLeft: 5,
    paddingVertical: 10
  },
  row:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  image: {
    width: 65,
    height: 65
  },
  userImage: {
    borderRadius: 35,
    margin: 20,
    alignSelf: 'center',
    backgroundColor: theme.variables.primary,
    padding:10
  },
  deleteAccount:{
    marginBottom:50
  },
  signedWithBtn:{
    alignSelf:'center',
    textAlign:'center',
    padding:2,
    width: 200,
    borderRadius: 30
  },
  googleColor: {
    backgroundColor: '#4285F4',
    color:'#fff'
  },
  facebookColor: {
    backgroundColor: '#4267B2',
    color:'#fff'
  },
  appleColor: {
    backgroundColor: '#fff',
    color:'#000'
  },
  id:{
    maxWidth:'90%'
  }
});

const DeleteAccount = React.memo(({ setButtonsDisabled }) => {
  const { t } = useTranslation();
  const {
    canDelete,
    request,
    loading,
    successVisible,
    hideSuccessPopup,
    confirmationPopupVisible,
    showConfirmationPopup,
    hideConfirmationPopup,
    confirmDelete,
    canConfirmDelete,
    username,
    setUsername
  } = useDeleteAccount(setButtonsDisabled);

  return (
    <View style={[styles.item, styles.deleteAccount]}>
      <ConfirmationPopup
        visible={confirmationPopupVisible}
        title={CapitalizeFirst(t('account:deleteAccountTitle'))}
        description={CapitalizeFirst(t('account:deleteAccountInfo'))}
        rejectText={CapitalizeFirst(t('genericButton.cancel'))}
        acceptText={CapitalizeFirst(t('genericButton.send'))}
        accept={confirmDelete}
        reject={hideConfirmationPopup}
        acceptDisabled={!canConfirmDelete}
      >
        <Input
          onChangeText={setUsername}
          value={username}
          label={CapitalizeFirst(t('account:username'))}
          textContentType='emailAddress'
          autoCapitalize='none'
          keyboardType='email-address'
          returnKeyType='next'
          disabled={loading}
          style={{height: 40}}
        />
      </ConfirmationPopup>
      <Popup visible={successVisible} onRequestClose={hideSuccessPopup} hide={hideSuccessPopup} hideCloseIcon>
        <Text
          size='p'
          align='center'
          content={CapitalizeFirst(t('account:deleteAccountSuccess'))}
        />
        <Button
          color='success'
          onPress={hideSuccessPopup}
          text={CapitalizeFirst(t('genericButton.ok'))}
        />
      </Popup>
      {loading && <ActivityIndicator size='large' color={theme.variables.spinnerColor} />}
      <RequestError request={request} />
      <Button
        type='link'
        color='alert'
        align='left'
        icon='trash'
        onPress={showConfirmationPopup}
        text={CapitalizeFirst(t('account:deleteAccount'))}
        disabled={!canDelete}
      />
    </View>
  )
});

const AccountScreen = React.memo(({navigation}) => {
  const { t } = useTranslation();
  const { user, request, session } = useUser();
  const signedWithEmail = session.provider === 'email' ? true : false;
  const [ buttonsDisabled, setButtonsDisabled ] = useState(false);

  return (
    <Screen>
      <ScrollView style={theme.common.contentContainer}>
        {user ? (
          <>
            {signedWithEmail ? (
              <Icon
                name='user'
                color={theme.variables.textInverse}
                style={styles.userImage}
                size={40}
              />
            ) : (
              <Image
                style={[styles.userImage, styles.image]}
                source={{uri: user.provider[0].picture}}
              />
            )}
            {(user.first_name || user.last_name) ?
              <Text
                size='p'
                color='secondary'
                align='center'
                content={(user.first_name && user.first_name) + ' ' + (user.last_name && user.last_name) }
              />
            :
              <Text
                size='p'
                color='secondary'
                align='center'
                content={CapitalizeFirst(t('account:namePlaceholder'))}
              />
            }
            {!signedWithEmail &&
              <Text
                size='p'
                color='secondary'
                style={[styles.signedWithBtn, styles[session.provider + 'Color']]}
                content={CapitalizeFirst(t('account:signedInWith', {provider: session.provider}))}
              />
            }
            <Button
              type='link'
              align='right'
              color='primary'
              onPress={() => navigation.navigate('ChangeUserDetailsScreen', {})}
              icon='edit-3'
              disabled={buttonsDisabled}
            />
            <View style={styles.item}>
              <Text
                size={14}
                bold
                content={CapitalizeFirst(t('account:uuid'))}
              />
              <View style={styles.row}>
                <Text
                  color='secondary'
                  content={user.meta.id}
                  style={styles.id}
                />
                <Button
                  type='link'
                  color='primary'
                  onPress={() =>  Clipboard.setString(user.meta.id)}
                  icon='copy'
                  disabled={buttonsDisabled}
                />
              </View>
            </View>
            {signedWithEmail &&
              <View style={styles.item}>
                <Button
                  type='link'
                  color='primary'
                  onPress={() => navigation.navigate('ChangeUsernameScreen', {})}
                  icon='edit-3'
                  align='left'
                  text={CapitalizeFirst(t('account:changeUsername'))}
                  disabled={buttonsDisabled}
                />
              </View>
            }

            <View style={styles.item}>
              <Button
                type='link'
                color='primary'
                text={CapitalizeFirst(t('account:changePassword'))}
                onPress={() => navigation.navigate(signedWithEmail ? 'ChangePasswordScreen' : 'RecoverPasswordScreen', {})}
                icon='edit-3'
                align='left'
                disabled={buttonsDisabled}
              />
            </View>
            <DeleteAccount setButtonsDisabled={setButtonsDisabled} />
          </>
        ) : request && request.status === 'pending' ? (
            <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
        ) : null}
        <RequestError request={request} />
      </ScrollView>
    </Screen>
  );
});

AccountScreen.navigationOptions = ({ navigation, t }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.account')),
    headerLeft: () => <MenuButton navigation={navigation} />,
  };
};

export default AccountScreen;
