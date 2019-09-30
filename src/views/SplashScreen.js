import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {
  View,
  Text
} from 'react-native';

import theme from "../theme/themeExport";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class SplashScreen extends Component {
  async checkSession(){
    try{
      let session = await AsyncStorage.getItem("session");
      if(session !== null){
        session = JSON.parse(session);
        this.session = session;
      }
      this.sessionRetrieved = true;
      if(this.timeoutEnded){
        this.props.navigation.navigate("LoginScreen", { session: session });
      }
    } catch(e){
      this.props.navigation.navigate("LoginScreen");
    }
  }
  componentDidMount(){
    this.checkSession();
    setTimeout(() => {
      this.timeoutEnded = true;
      if(this.sessionRetrieved){
        this.props.navigation.navigate("LoginScreen", { session: this.session });
      }
    }, 500);
  }
  render() {
    return (
      <View style={theme.common.SplashScreenContainer}>
        <Icon name="kiwi-bird" size={100} color={theme.variables.white} />
      </View>
    );
  }
}
