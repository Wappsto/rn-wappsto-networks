import React from "react";
import color from "color";
import { StyleSheet } from "react-native";
import { Platform, Dimensions } from "react-native";
let variables = require("./../variables/generic").default;

const deviceHeight = Dimensions.get("window").height;


export default StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical:5,
    backgroundColor: variables.containerBgColor
  },
  centeredContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: variables.white
  },
  row:{
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItem:{
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
    padding:8,
    borderRadius: variables.borderRadiusBase,
    backgroundColor: color(variables.white).fade(0.1)
  },
  listItemTitleArea:{
    flex: 1
  },
  listItemArrow: {
    padding: 15,
    //backgroundColor:"yellow"
  },
  listItemHeader:{
    fontSize:variables.defaultFontSize + 4,
    color:variables.primary
  },
  listItemSubheader:{
    fontSize: variables.defaultFontSize - 1,
    color: variables.textSecondary
  },
  infoPanel:{
    flex:1,
    marginVertical: 5,
    marginHorizontal: 10,
    padding:8,
    borderRadius: variables.borderRadiusBase,
  //  backgroundColor: variables.containerBgColor
  },
  logoArea:{
    padding:20,
    marginVertical: 30,
    alignItems: 'center',
    color: "white",
    marginHorizontal: 10
  },
  formElements:{
    flex: 1,
    borderTopRightRadius: variables.borderRadiusLarge,
    borderTopLeftRadius: variables.borderRadiusLarge,
    backgroundColor: color(variables.primary).lighten(4),
    paddingHorizontal: 20,
    paddingTop: 20
  },
  label:{
    fontSize: variables.inputTextSize - 2,
    color: variables.inputBorderColor
  },
  input: {
    fontSize: variables.inputTextSize,
    height: variables.inputHeightBase,
    backgroundColor: variables.inputBg,
    borderColor: variables.inputBorderColor,
    borderWidth: variables.borderWidth,
    borderRadius: variables.borderRadiusBase,
    paddingHorizontal: 10,
    marginBottom: 12
  },
  button:{
    backgroundColor: variables.buttonBg,
    marginVertical: 20,
    borderRadius: variables.borderRadiusBase,
    alignItems:"center",
    height: variables.inputHeightBase,
    padding:15
  },
  roundOutline:{
    padding:10,
    borderRadius: 50,
    backgroundColor: color(variables.primary).lighten(4)
  },
  btnText:{
    fontSize: variables.buttonTextSize,
    color: variables.buttonColor
  },
  disabled:{
    backgroundColor: variables.disabled
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: variables.modalBgColor
  },
  eyeIcon:{
    position: 'absolute',
    right: 0,
    padding: 17
  }
});
