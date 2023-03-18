import React from 'react';
import { View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../../../theme/themeExport';
import { TYPES } from '../params';
import styles from './styles';

const TypeSelector = React.memo(({ type, setOptions }) => {
  const onChangeType = (_, selectedType) => {
    setOptions((options) =>
      options.type === selectedType ? options : { ...options, type: selectedType, value: '' },
    );
  };
  return (
    <ModalDropdown
      dropdownStyle={[styles.dropdownContainer, { marginLeft: 5 }]}
      defaultValue={type}
      defaultIndex={0}
      options={TYPES}
      renderRow={(option, _, isSelected) => (
        <Icon
          size={15}
          name={option}
          style={styles.typeIconStyle}
          color={isSelected ? theme.variables.disabled : theme.variables.textColor}
        />
      )}
      onSelect={onChangeType}>
      <View style={styles.typeSelectionButton}>
        <Icon size={15} name={type} />
        <Icon size={10} name="chevron-down" />
      </View>
    </ModalDropdown>
  );
});
export default TypeSelector;
