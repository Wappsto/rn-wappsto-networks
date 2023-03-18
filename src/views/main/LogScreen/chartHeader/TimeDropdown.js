import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { getDateOptions } from '../helpers';
import { TIME_OPTIONS } from '../params';
import styles from './styles';

const TimeDropdown = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getDateOptions(selectedValue.time, selectedValue.number, 0, autoCompute);
    setOptions((options) => {
      const n = {
        ...options,
        ...newOptions,
        value: selectedValue,
        type: 'clock',
      };
      delete n.limit;
      delete n.order;
      return n;
    });
  };
  return (
    <ModalDropdown
      style={styles.dropdownButton}
      textStyle={styles.dropdownButtonText}
      dropdownStyle={[styles.dropdownContainer, { paddingHorizontal: 10 }]}
      defaultValue={CapitalizeFirst(
        t(value?.time ? 'log:lastOptions.lastXTimeFrame' : 'genericButton.select', {
          x: value?.number,
          time: value?.time,
        }),
      )}
      options={TIME_OPTIONS}
      onSelect={onChangeValue}
      renderButtonText={(option) =>
        CapitalizeFirst(
          t('log:lastOptions.lastXTimeFrame', {
            x: option.number,
            time: option.time,
          }),
        )
      }
      renderRow={(option, _, isSelected) => (
        <Text
          style={styles.dropdownText}
          content={CapitalizeFirst(
            t('log:lastOptions.lastXTimeFrame', {
              x: option.number,
              time: option.time,
            }),
          )}
          color={isSelected ? theme.variables.disabled : 'primary'}
        />
      )}
    />
  );
});
export default TimeDropdown;
