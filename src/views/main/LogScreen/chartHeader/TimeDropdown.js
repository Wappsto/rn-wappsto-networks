import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Feather';
import { useVisible } from 'wappsto-blanket';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { getDateOptions } from '../helpers';
import { TIME_OPTIONS } from '../params';
import styles from './styles';

const TimeDropdown = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const [visible, show, hide] = useVisible(false);

  const onChangeValue = selectedValue => {
    const newOptions = getDateOptions(selectedValue.time, selectedValue.number, 0, autoCompute);
    setOptions(options => {
      const n = {
        ...options,
        ...newOptions,
        value: selectedValue,
        type: 'timeBased',
      };
      delete n.limit;
      delete n.order;
      return n;
    });
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
                ? value.number + ' ' + t(`log:timeFrame.${value.time}`, { count: value.number })
                : CapitalizeFirst(t('genericButton.select'))
            }
          />
          <Icon size={12} name="chevron-down" color={theme.variables.textSecondary} />
        </TouchableOpacity>
      }>
      <ScrollView bounces={false}>
        {TIME_OPTIONS.map(v => (
          <TouchableOpacity
            key={v.number + v.time}
            style={styles.dropdownButton}
            onPress={() => onChangeValue(v)}
            disabled={v.number === value.number && v.time === value.time}>
            <Text
              style={styles.dropdownButtonText}
              content={v.number + ' ' + t(`log:timeFrame.${v.time}`, { count: v.number })}
              color={
                v.number === value.number && v.time === value.time
                  ? theme.variables.disabled
                  : 'primary'
              }
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Popover>
  );
});
export default TimeDropdown;
