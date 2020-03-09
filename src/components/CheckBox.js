import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../theme/themeExport';

const CheckBox = ({ checked, onPress, style, textStyle, size = 30, color = theme.variables.primary, text = '', ...props}) => (
  <TouchableOpacity style={[theme.common.row, style]} onPress={onPress} {...props}>
    <Icon
      size={size}
      color={color}
      name={ checked ? 'check-box' : 'check-box-outline-blank'}
    />
    <Text style={textStyle}>{text}</Text>
  </TouchableOpacity>
)

export default CheckBox;
