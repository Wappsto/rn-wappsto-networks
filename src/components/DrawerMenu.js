import AsyncStorage from '@react-native-community/async-storage';
import SafeAreaView from 'react-native-safe-area-view';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import RequestError from './RequestError';
import React, { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux/actions/items';
import { closeStream } from 'wappsto-redux/actions/stream';
import { getUserData } from 'wappsto-redux/selectors/entities';
import { getSession } from 'wappsto-redux/selectors/session';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import { config } from '../configureWappstoRedux';
import { userFetched } from '../util/params';

const styles = StyleSheet.create({
  userInfo: {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userImage: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
  },
});

const DrawerMenu = React.memo((props) => {
  const dispatch = useDispatch();
  const session = useSelector(getSession);
  const user = useSelector(getUserData);
  const { request, send } = useRequest();
  const { send: sendDelete } = useRequest();
  const getItem = useMemo(makeItemSelector, []);
  const fetched = useSelector(state => getItem(state, userFetched));

  const getUser = useCallback(() => {
    send({
      method: 'GET',
      url: '/user',
      query: {
        me: true,
        expand: 0
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetched) {
      dispatch(setItem(userFetched, true));
      getUser();
    } else if (request && request.status === 'error') {
      getUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    if (config.stream) {
      dispatch(closeStream(config.stream.name));
    }
    sendDelete({ method: 'DELETE', url: '/session/' + session.meta.id });
    AsyncStorage.removeItem('session');
    props.navigation.navigate('LoginScreen');
  }

  let name = '';
  if (user) {
    if (user.nickname) {
      name = user.nickname;
    } else {
      if (user.first_name) {
        name += user.first_name + ' ';
      }
      if (user.last_name) {
        name += user.last_name;
      }

      if (!name) {
        if (user.provider[0] && user.provider[0].name) {
          name = user.provider[0].name;
        } else {
          name = user.email;
        }
      }
    }
  }
  return (
    <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
      <StatusBar
        backgroundColor={theme.variables.white}
        barStyle="dark-content"
      />
      <ScrollView>
        <View style={styles.userInfo}>
          <View style={theme.common.row}>
            <View>
              {user && user.provider[0] ? (
                <Image
                  style={styles.userImage}
                  source={{uri: user.provider[0].picture}}
                />
              ) : request &&
                request.method === 'GET' &&
                request.status === 'pending' ? (
                <ActivityIndicator
                  size="large"
                  color={theme.variables.primary}
                />
              ) : (
                <Icon
                  name="user"
                  style={theme.common.spaceAround}
                  size={20}
                  color={theme.variables.primary}
                />
              )}
            </View>
            <Text>{name}</Text>
          </View>
          <TouchableOpacity
            style={theme.common.spaceAround}
            onPress={logout}>
            <Icon
              name="log-out"
              size={25}
              color={theme.variables.primary}
            />
          </TouchableOpacity>
          <RequestError request={request} />
        </View>
        <DrawerNavigatorItems {...props} />
      </ScrollView>
    </SafeAreaView>
  );
});

export default DrawerMenu;
