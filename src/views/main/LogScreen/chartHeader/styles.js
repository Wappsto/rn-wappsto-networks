import { StyleSheet } from 'react-native';
import theme from '../../../../theme/themeExport';

const headerHeight = 35;

const styles = StyleSheet.create({
  typeSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 9,
    height: headerHeight,
    marginHorizontal: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  button: {
    minWidth: headerHeight,
    height: headerHeight,
    lineHeight: headerHeight,
    margin: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonFlex: {
    alignItems: 'flex-start',
    flex: 1,
  },
  buttonDisabled: {
    backgroundColor: theme.variables.disabled,
  },
  textDisabled: {
    color: theme.variables.disabled,
  },
  dropdownContainer: {
    height: 'auto',
    borderColor: '#ccc',
    marginTop: -1,
    borderWidth: 1,
  },
  dropdownText: {
    width: '100%',
    height: headerHeight + 5,
    lineHeight: headerHeight + 5,
    paddingHorizontal: 10,
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  dropdownButtonInput: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    borderColor: theme.variables.borderColor,
    borderWidth: theme.variables.borderWidth,
  },
  dropdownButtonText: {
    width: '100%',
    height: headerHeight,
    lineHeight: headerHeight,
    paddingHorizontal: 8,
  },
  typeIconStyle: {
    padding: 15,
    paddingRight: 20,
  },
  chartContainer: {
    marginBottom: 30,
  },
  liveCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  liveOn: {
    backgroundColor: 'green',
  },
  liveOff: {
    backgroundColor: '#c9c9c9',
  },
  smallText: {
    fontSize: 12,
  },
});

export default styles;
