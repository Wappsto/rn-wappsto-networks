import React from 'react';
import { TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Feather';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { getXValueOptions } from '../helpers';
import { POINT_OPTIONS } from '../params';
import styles from './styles';

const PointDropdown = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const [visible, show, hide] = useVisible(false);

  const onChangeValue = (selectedValue) => {
    const newOptions = getXValueOptions(selectedValue, 0, autoCompute);
    setOptions((options) => ({ ...options, ...newOptions }));
    hide();
  };

  return (
    <Popover
      placement={PopoverPlacement.BOTTOM}
      isVisible={visible}
      onRequestClose={hide}
      from={
        <TouchableOpacity style={[styles.button, styles.buttonFlex]} onPress={show}>
          <Text
            style={styles.smallText}
            content={
              value?.number
                ? value.number + ' ' + t('log:point', { count: value.number })
                : CapitalizeFirst(t('genericButton.select'))
            }
          />
          <Icon size={12} name="chevron-down" color={theme.variables.textSecondary} />
        </TouchableOpacity>
      }>
      {POINT_OPTIONS.map((number) => (
        <TouchableOpacity
          key={number}
          style={styles.dropdownButton}
          onPress={() => onChangeValue(number)}
          disabled={number === value.number}>
          <Text
            style={styles.dropdownButtonText}
            content={number + ' ' + t('log:point', { count: value.number })}
            color={number === value.number ? theme.variables.disabled : 'primary'}
          />
        </TouchableOpacity>
      ))}
    </Popover>
  );
});

export default PointDropdown;
