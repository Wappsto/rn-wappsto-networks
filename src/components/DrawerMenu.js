import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import Color from 'color';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import VersionNumber from 'react-native-version-number';
import useUser from '../hooks/useUser';
import theme from '../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../translations';
import Button from './Button';
import RequestError from './RequestError';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginVertical: 4,
    borderBottomColor: Color(theme.variables.primary).lighten(0.1).hex(),
    borderBottomWidth: theme.variables.borderWidth,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 40,
    marginHorizontal: 5,
  },
  userImage: {
    backgroundColor: theme.variables.lightGray,
    width: 35,
    height: 35,
    borderRadius: 20,
    margin: 8,
  },
  userName: {
    flex: 1,
    marginLeft: 8,
    color: theme.variables.textInverse,
  },
  logoutBtn: {
    marginBottom: 20,
    marginLeft: 5,
  },
  versionNr: {
    fontSize: 12,
    margin: 10,
  },
});
const DrawerMenu = React.memo(props => {
  const { t } = useTranslation();
  const { user, name, logout, request } = useUser();

  for (const view in props.descriptors) {
    if (!props.descriptors[view].options) {
      props.descriptors[view].options = {};
    }
    if (!props.descriptors[view].options.drawerLabel) {
      const route = props.state.routes.find(route => route.key === view);
      if (route) {
        props.descriptors[view].options.drawerLabel = CapitalizeFirst(t('pageTitle.' + route.name));
      }
    }
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container} bounces={false}>
      <View>
        <View style={styles.userInfo}>
          {user && user.provider[0] ? (
            <Image style={styles.userImage} source={{ uri: user.provider[0].picture }} />
          ) : request && request.method === 'GET' && request.status === 'pending' ? (
            <ActivityIndicator size="large" color={theme.variables.spinnerInverseColor} />
          ) : (
            <Icon name="user" color={theme.variables.drawerMenuText} size={20} />
          )}
          <Text ellipsizeMode="middle" numberOfLines={1} style={styles.userName} content={name}>
            {name}
          </Text>
          <RequestError request={request} />
        </View>
        <DrawerItemList {...props} />
      </View>
      <View style={styles.row}>
        <Button
          type="link"
          color={theme.headerStyle.colors.text}
          align="left"
          bold
          onPress={logout}
          text={CapitalizeFirst(t('logout'))}
        />
        <Text style={styles.versionNr} color={theme.variables.textInverse}>
          v{VersionNumber.appVersion}
        </Text>
      </View>
    </DrawerContentScrollView>
  );
});

DrawerMenu.displayName = 'DrawerMenu';
export default DrawerMenu;
