import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  icon: { paddingLeft: 10, paddingTop: 3 },
});

const MenuButton = React.memo(() => {
  const navigation = useNavigation();
  return (
    <Icon
      name="menu"
      size={24}
      style={styles.icon}
      color={theme.variables.headerColor}
      onPress={() => navigation.toggleDrawer()}
    />
  );
});

export default MenuButton;
