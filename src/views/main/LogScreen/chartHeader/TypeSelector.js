import React from 'react';
import { TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Feather';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { TYPES } from '../params';
import styles from './styles';

const ICON_MAPPING = {
  pointBased: 'hash',
  timeBased: 'clock',
};

const TypeSelector = React.memo(({ type, setOptions }) => {
  const { t } = useTranslation();
  const [visible, show, hide] = useVisible(false);
  const onChangeType = (selectedType) => {
    setOptions((options) =>
      options.type === selectedType ? options : { ...options, type: selectedType, value: '' },
    );
  };

  return (
    <Popover
      placement={PopoverPlacement.BOTTOM}
      isVisible={visible}
      onRequestClose={hide}
      from={
        <TouchableOpacity style={[styles.button]} onPress={show}>
          <Icon
            size={15}
            name={ICON_MAPPING[type]}
            style={styles.typeIconStyle}
            color={theme.variables.textColor}
          />
        </TouchableOpacity>
      }>
      {TYPES.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.dropdownButton, theme.common.row]}
          onPress={() => onChangeType(option)}
          disabled={option === type}>
          <Icon
            size={15}
            name={ICON_MAPPING[option]}
            style={styles.typeIconStyle}
            color={option === type ? theme.variables.disabled : theme.variables.textColor}
          />
          <Text
            style={styles.dropdownButtonText}
            content={CapitalizeFirst(t(`log:chartDataType.${option}`))}
            color={option === type ? theme.variables.disabled : theme.variables.textColor}
          />
        </TouchableOpacity>
      ))}
    </Popover>
  );
});
export default TypeSelector;
