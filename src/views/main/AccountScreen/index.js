import React, {useState} from 'react';
import { Clipboard, View, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
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

const AccountScreen = React.memo(({navigation}) => {
  const { t } = useTranslation();
  const { user, request, session } = useUser();
  const signedWithEmail = session.provider === 'email' ? true : false;
  const [ showConfirmationPopup, setShowConfirmationPopup ] = useState(false);

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
            <Text
              size='p'
              color='secondary'
              align='center'
              content={!!user.first_name && user.first_name + !!user.last_name && user.last_name + !!user.nickname && user.nickname }
            />
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
                />
              </View>
            </View>
            <View style={styles.item}>
              <Text
                size={14}
                bold
                content={CapitalizeFirst(t('account:username'))}
              />
              <View style={styles.row}>
                <Text
                  color='secondary'
                  content={session.username}
                />
                {signedWithEmail &&
                  <Button
                    type='link'
                    color='primary'
                    onPress={() => navigation.navigate('ChangeUsernameScreen', {})}
                    icon='edit-3'
                  />
                }
              </View>
            </View>

            <View style={styles.item}>
              <Text
                size={14}
                bold
                content={CapitalizeFirst(t('account:password'))}
              />
                <View style={styles.row}>
                  <Text
                    color='secondary'
                    content='••••••'
                  />
                  <Button
                    type='link'
                    color='primary'
                    onPress={() => navigation.navigate(signedWithEmail ? 'ChangePasswordScreen' : 'RecoverPasswordScreen', {})}
                    icon='edit-3'
                  />
                </View>
            </View>
            <ConfirmationPopup
              visible={showConfirmationPopup}
              title={CapitalizeFirst(t('account:deleteAccountTitle'))}
              description={CapitalizeFirst(t('account:deleteAccountInfo'))}
              rejectText={CapitalizeFirst(t('genericButton.cancel'))}
              acceptText={CapitalizeFirst(t('genericButton.send'))}
              accept={() => setShowConfirmationPopup(false)}
            />
            <View style={[styles.item, styles.deleteAccount]}>
              <Button
                type='link'
                color='alert'
                onPress={() => setShowConfirmationPopup(true)}
                text={CapitalizeFirst(t('account:deleteAccount'))}
              />
            </View>
          </>
        ) : request && request.status === 'pending' ? (
            <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
        ) : null}
        <RequestError request={request} />
      </ScrollView>
    </Screen>
  );
});

AccountScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: CapitalizeEach(t('pageTitle.account')),
    headerLeft: <MenuButton navigation={navigation} />,
  };
};

export default AccountScreen;
