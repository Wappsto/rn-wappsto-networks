import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { View, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import Text from './Text';
import Button from './Button';
import Icon from 'react-native-vector-icons/Feather';
import { useTranslation, CapitalizeFirst } from '../translations';
import useUser from '../hooks/useUser';

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:theme.variables.drawerMenuBgColor,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:4,
    borderBottomColor: theme.variables.lightGray,
    borderBottomWidth: theme.variables.borderWidth
  },
  userImage: {
    backgroundColor:theme.variables.lightGray,
    width: 35,
    height: 35,
    borderRadius: 20,
    margin: 8,
  }
});
const DrawerMenu = React.memo((props) => {
  const { t } = useTranslation();
  const { user, name, logout, request } = useUser(props.navigation);
  for(const view in props.descriptors){
    if(!props.descriptors[view].options) {
      props.descriptors[view].options = {};
    }
    if(!props.descriptors[view].options.drawerLabel){
      props.descriptors[view].options.drawerLabel = CapitalizeFirst(t('pageTitle.' + view));
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.userInfo}>
            {user && user.provider[0] ? (
              <Image
                style={styles.userImage}
                source={{uri: user.provider[0].picture}}
              />
            ) : request &&
              request.method === 'GET' &&
              request.status === 'pending' ? (
              <ActivityIndicator
                size='large'
                color={theme.variables.spinnerInverseColor}
              />
            ) : (
              <Icon
                name='user'
                color={theme.variables.drawerMenuText}
                style={theme.common.spaceAround}
                size={20}
              />
            )}
            <Text
              content={name}
            />
          <RequestError request={request} />
        </View>
        <DrawerNavigatorItems {...props} />
      </ScrollView>
      <Button
        type='link'
        color='primary'
        align='left'
        onPress={logout}
        text={CapitalizeFirst(t('logout'))}
      />
    </SafeAreaView>
  );
});

export default DrawerMenu;
