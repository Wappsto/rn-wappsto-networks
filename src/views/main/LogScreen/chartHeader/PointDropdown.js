import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
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
  const [range, setRange] = useState();

  const onChangeValue = (selectedValue) => {
    const newOptions = getXValueOptions(selectedValue, 0, autoCompute);
    setOptions((options) => ({ ...options, ...newOptions }));
  };

  useEffect(() => {
    if (value?.arrowClick) {
      setRange(
        value.number * value.arrowClick + ' - ' + (value.number * value.arrowClick + value.number),
      );
    } else {
      setRange();
    }
  }, [value]);

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
                ? range
                  ? range
                  : CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: value.number }))
                : CapitalizeFirst(t('genericButton.select'))
            }
          />
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
            content={CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: number }))}
            color={number === value.number ? theme.variables.disabled : 'primary'}
          />
        </TouchableOpacity>
      ))}
    </Popover>
  );
});

export default PointDropdown;
