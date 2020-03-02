import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';
import i18n, { CapitalizeFirst } from '../translations';
import useUser from '../hooks/useUser';

const DrawerMenu = React.memo((props) => {
  const { user, name, logout, request } = useUser(props.navigation);
  return (
    <SafeAreaView style={{flex:1}}>
      <ScrollView>
        <View style={theme.common.userInfo}>
            {user && user.provider[0] ? (
              <Image
                style={theme.common.userImage}
                source={{uri: user.provider[0].picture}}
              />
            ) : request &&
              request.method === 'GET' &&
              request.status === 'pending' ? (
              <ActivityIndicator
                size='large'
                color={theme.variables.textInverse}
              />
            ) : (
              <Icon
                name='user'
                style={theme.common.spaceAround}
                size={20}
              />
            )}
            <Text>{name}</Text>
          <RequestError request={request} />
        </View>
        <DrawerNavigatorItems {...props} />

      </ScrollView>
      <TouchableOpacity
        style={theme.common.spaceAround}
        onPress={logout}>
        <Text style={theme.common.linkBtn}>
          {CapitalizeFirst(i18n.t('logout'))}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default DrawerMenu;
