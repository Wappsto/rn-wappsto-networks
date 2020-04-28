import React from 'react';
import color from 'color';
import {StyleSheet} from 'react-native';

let variables = require('./../variables/generic').default;
let styles = {};

export function generateStyles(c = {}) {
  Object.assign(
    styles,
    StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: variables.appBgColor
      },
      warningPanel: {
        backgroundColor: variables.warning,
        color: variables.white,
      },
      toastFullWidth: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        width: '100%',
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center'
      },
      card: {
        backgroundColor: variables.cardBgColor,
        borderRadius: variables.borderRadiusBase,
        borderWidth: variables.borderWidth,
        borderColor: variables.cardBorderColor,
        paddingHorizontal: 15,
        paddingVertical: 20,
        marginBottom: 25,
      },
      spaceAround: {
        padding: 12,
      },
      spaceBottom: {
        marginBottom: 12,
      },
      spaceLeft: {
        marginLeft: 12,
      },
      image:{
        alignSelf:'center',
        marginTop: 20,
        marginBottom:40
      },
      iconButton: {
        paddingRight: 14,
        paddingLeft: 14,
        color: variables.primary
      },
      contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 20
      },
      primaryColor:{
        color: variables.primary
      },
      ghost: {
        backgroundColor: 'transparent'
      },
      disabled: {
        backgroundColor: variables.disabled,
      },
      modalBackground: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'space-around',
        backgroundColor: variables.modalBgColor,
      },
      fullScreenModalContent: {
        padding: 20,
        flex:2
      },
      seperator: {
        marginVertical: 20,
        borderBottomColor: variables.lightGray,
        borderBottomWidth: variables.borderWidth,
      },
      headerButton:{
        marginTop: variables.platform === 'ios' ? 0 : 6
      },
      ...c,
    }),
  );
  return styles;
}

generateStyles();

export default styles;
