import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import RequestError from "./RequestError";

import * as request from 'wappsto-redux/actions/request';
import * as items from 'wappsto-redux/actions/items';

import { getUserData } from 'wappsto-redux/selectors/entities';
import { getRequest } from 'wappsto-redux/selectors/request';
import { getSession } from 'wappsto-redux/selectors/session';
import { getItem } from 'wappsto-redux/selectors/items';


import theme from "../theme/themeExport";
import Icon from 'react-native-vector-icons/Feather';

function mapStateToProps(state){
  return {
    userRequest: getRequest(state, "/user", "GET"),
    user: getUserData(state),
    session: getSession(state),
    fetched: getItem(state, "user_fetched")
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators({ ...request, ...items}, dispatch)
  }
}

class DrawerMenu extends Component {
  constructor(props){
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount(){
    if(!this.props.fetched){
      this.props.setItem("user_fetched", true);
      this.props.makeRequest("GET", "/user", null, { query: { expand: 0 } });
    } else if(this.props.userRequest && this.props.userRequest.status === "error"){
      this.props.makeRequest("GET", "/user", null, { query: { expand: 0 } });
    }
  }

  logout(){
    this.props.makeRequest("DELETE", "/session/" + this.props.session.meta.id);
    AsyncStorage.removeItem("session");
    this.props.navigation.navigate("LoginScreen");
  }

  render() {
    let usersRequest = this.props.usersRequest;
    let user = this.props.user;
    return (
      <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
        <ScrollView>
          <View style={styles.userInfo}>
            {
              user ?
                <Fragment>
                  <View style={theme.common.row}>
                    <View >
                      {
                        user.provider[0] ?
                          <Image style={styles.userImage} source={{ uri: user.provider[0].picture }}/>
                        : <Icon name="user" style={theme.common.roundOutline} size={25} color={theme.variables.primary} />
                      }
                    </View>
                    <Text>{user.first_name || user.provider[0] && user.provider[0].name}</Text>
                  </View>
                  <TouchableOpacity style={theme.common.roundOutline} onPress={this.logout}>
                    <Icon name="log-out" size={20} color={theme.variables.primary} />
                  </TouchableOpacity>
                </Fragment>
              :
                usersRequest && usersRequest.method === "GET" && usersRequest.status === "pending" ?
                <ActivityIndicator size="large" color={theme.variables.primary} />
                : null
            }
            <RequestError error={usersRequest}/>
          </View>
          <DrawerItems {...this.props} />
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  userInfo: {
    padding:10,
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMenu);
