import React from 'react';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

const MenuButton = React.memo(({ navigation }) => {
  return (
    <Icon
      name='menu'
      size={24}
      style={{paddingLeft: 10, paddingTop: 3}}
      color={theme.variables.white}
      onPress={() => navigation.openDrawer()}
    />
  );
});

export default MenuButton;
