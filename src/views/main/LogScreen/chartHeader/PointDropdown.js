import React from 'react';
import ModalDropdown from 'react-native-modal-dropdown';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { getXValueOptions } from '../helpers';
import { POINT_OPTIONS } from '../params';
import styles from './styles';

const PointDropdown = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getXValueOptions(selectedValue, 0, autoCompute);
    setOptions((options) => ({ ...options, ...newOptions }));
  };
  return (
    <ModalDropdown
      style={styles.dropdownButton}
      textStyle={styles.dropdownButtonText}
      dropdownStyle={styles.dropdownContainer}
      defaultValue={CapitalizeFirst(
        t(value?.number ? 'log:lastOptions.lastXPoints' : 'genericButton.select', {
          x: value.number,
        }),
      )}
      defaultIndex={0}
      options={POINT_OPTIONS}
      onSelect={onChangeValue}
      renderButtonText={(option) =>
        CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: option }))
      }
      renderRow={(option, _, isSelected) => (
        <Text
          style={styles.dropdownText}
          content={CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: option }))}
          color={isSelected ? theme.variables.disabled : 'primary'}
        />
      )}
    />
  );
});

export default PointDropdown;
