import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import Text from '../components/Text';

const styles = StyleSheet.create({
  checkbox: {
    marginRight: 10,
  },
  container: {
    marginVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const CheckBox = ({
  checked,
  onPress,
  style,
  textStyle,
  size = 30,
  color = theme.variables.primary,
  text = '',
  ...props
}) => (
  <TouchableOpacity style={[styles.container, style]} onPress={onPress} {...props}>
    <Icon
      size={size}
      style={styles.checkbox}
      color={color}
      name={checked ? 'check-square' : 'square'}
    />
    <Text style={[textStyle, { flex: 1 }]} content={text} />
  </TouchableOpacity>
);

CheckBox.displayName = 'CheckBox';
export default CheckBox;
