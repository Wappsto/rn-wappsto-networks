import React from 'react';
import color from 'color';
import {StyleSheet} from 'react-native';
import {Platform, Dimensions} from 'react-native';

import {TextInput} from 'react-native';

let variables = require('./../variables/generic').default;
let styles = {};

TextInput.defaultProps.selectionColor = variables.darkGray;

export function generateStyles(c = {}) {
  Object.assign(
    styles,
    StyleSheet.create({
      container: {
        flex: 1,
        paddingVertical: 5,
        backgroundColor: variables.containerBgColor,
      },
      safeAreaView: {
        flex: 1,
        backgroundColor: variables.appBgColor,
      },
      infoText: {
        padding: 5,
        margin: 20,
        textAlign: 'center',
        borderRadius: variables.borderRadiusBase,
        borderWidth: variables.borderWidth,
      },
      p: {
        color: variables.textSecondary,
        marginBottom: 20,
      },
      error: {
        borderColor: variables.alert,
        color: variables.alert,
      },
      warning: {
        borderColor: variables.warning,
        color: variables.warning,
      },
      success: {
        borderColor: variables.success,
        color: variables.success,
      },
      secondary: {
        borderColor: variables.textSecondary,
        color: variables.textSecondary,
      },
      errorPanel: {
        backgroundColor: variables.alert,
        color: variables.white,
      },
      warningPanel: {
        backgroundColor: variables.warning,
        color: variables.white,
      },
      successPanel: {
        backgroundColor: variables.success,
        color: variables.white,
      },
      toastFullWidth: {
        paddingHorizontal: 10,
        paddingVertical: 20,
        width: '100%',
      },
      centeredContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: variables.white,
      },
      row: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      H1: {
        fontSize: variables.h1,
        marginBottom: variables.h1 / 2,
      },
      H2: {
        fontSize: variables.h2,
        marginBottom: variables.h2 / 2,
      },
      H3: {
        fontSize: variables.h3,
        marginBottom: variables.h3 / 2,
      },
      H4: {
        fontSize: variables.h4,
        marginBottom: variables.h4 / 2,
      },
      H5: {
        fontSize: variables.h5,
        marginBottom: variables.h5 / 2,
      },
      H6: {
        fontSize: variables.h6,
        marginBottom: variables.h6 / 2,
        fontWeight: 'bold',
      },
      spaceAround: {
        padding: 15,
      },
      spaceBottom: {
        marginBottom: 15,
      },
      spaceTop: {
        marginTop: 15,
      },
      listItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 10,
        padding: 8,
        borderRadius: variables.borderRadiusBase,
        backgroundColor: variables.white,
      },
      listItemTitleArea: {
        flex: 1,
        fontWeight: '600',
        fontSize: variables.h4,
      },
      iconButton: {
        padding: 12,
      },
      listItemHeader: {
        fontSize: variables.h4,
        color: variables.primary,
      },
      listItemSubheader: {
        fontSize: variables.defaultFontSize - 1,
        color: variables.textSecondary,
      },
      header: {
        padding: 20,
        alignItems: 'center',
      },
      footer: {
        alignItems: 'center',
        padding: 10,
      },
      formElements: {
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      label: {
        fontSize: variables.inputTextSize - 2,
        color: variables.textColor,
      },
      input: {
        fontSize: variables.inputTextSize,
        height: variables.inputHeight,
        backgroundColor: variables.inputBg,
        borderColor: variables.inputBorderColor,
        borderWidth: variables.borderWidth,
        borderRadius: variables.borderRadiusBase,
        paddingHorizontal: 10,
        marginBottom: 12,
        width: '100%',
      },
      button: {
        backgroundColor: variables.buttonBg,
        marginVertical: 20,
        borderRadius: variables.borderRadiusBase,
        alignItems: 'center',
        height: variables.inputHeightBase,
        padding: 15,
      },
      gSignInButton: {
        width: 192,
        height: 48,
        alignSelf: 'center',
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      btnText: {
        fontSize: variables.buttonTextSize,
        color: variables.buttonColor,
      },
      actionText: {
        color: variables.primary,
        textDecorationLine: 'underline',
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
      popupOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
      },
      popupContent: {
        backgroundColor: variables.modalBgColor,
        margin: 20,
        padding: 20,
      },
      passwordVisibilityButton: {
        position: 'absolute',
        right: 0,
        padding: 18,
      },
      seperator: {
        marginVertical: 20,
        borderBottomColor: variables.lightGray,
        borderBottomWidth: variables.borderWidth,
      },
      itemPanel: {
        flex: 1,
        justifyContent: 'space-between',
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: variables.panelBgColor,
        borderRadius: variables.borderRadiusBase,
      },
      itemContent: {
        padding: 15,
      },
      itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderBottomColor: variables.lightGray,
        borderBottomWidth: variables.borderWidth,
      },
      timestamp: {
        color: variables.darkGray,
        fontStyle: 'italic',
      },
      listHeader: {
        backgroundColor: variables.containerBgColor,
        color: variables.textSecondary,
        paddingHorizontal: 10,
        paddingTop: 10,
      },
      ...c,
    }),
  );
  return styles;
}

generateStyles();

export default styles;
