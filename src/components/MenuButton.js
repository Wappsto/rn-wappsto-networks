import React from 'react';
import { StyleSheet } from 'react-native';
import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  icon: {paddingLeft: 10, paddingTop: 3}
});

const MenuButton = React.memo(({ navigation }) => {
  return (
    <Icon
      name='menu'
      size={24}
      style={styles.icon}
      color={theme.variables.headerColor}
      onPress={() => navigation.openDrawer()}
    />
  );
});

export default MenuButton;
