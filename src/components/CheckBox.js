import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../theme/themeExport';
import Text from '../components/Text';

const CheckBox = ({ checked, onPress, style, textStyle, size = 30, color = theme.variables.primary, text = '', ...props}) => (
  <TouchableOpacity style={[theme.common.row, style]} onPress={onPress} {...props}>
    <Icon
      size={size}
      color={color}
      name={ checked ? 'check-square' : 'square'}
    />
    <Text
      style={textStyle}
      content={text}
    />
  </TouchableOpacity>
)

export default CheckBox;
