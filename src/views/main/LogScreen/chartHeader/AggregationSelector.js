import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import { useVisible } from 'wappsto-blanket';
import Button from '../../../../components/Button';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { GROUP_BY, OPERATIONS } from '../params';
import styles from './styles';

const AggregationSelector = React.memo(
  ({ operation = 'none', group_by = 'minute', setOptions }) => {
    const { t } = useTranslation();
    const [visible, show, hide] = useVisible(false);
    const [localOptions, setLocalOptions] = useState({
      operation: operation || 'none',
      group_by: group_by || 'minute',
    });
    const disabled =
      (localOptions.operation !== 'none' && localOptions.group_by === 'none') ||
      (localOptions.operation === operation && localOptions.group_by === group_by) ||
      (localOptions.operation === 'none' &&
        localOptions.group_by === 'none' &&
        !operation &&
        !group_by);

    const resetAndShow = () => {
      setLocalOptions({
        operation: operation || 'none',
        group_by: group_by || 'minute',
      });
      show();
    };

    const onChangeOperation = (_, selectedOperation) => {
      setLocalOptions(options => ({
        ...options,
        operation: selectedOperation,
        group_by: selectedOperation === 'none' ? 'minute' : options.group_by,
      }));
    };

    const onChangeGroupBy = (_, selectedGB) => {
      setLocalOptions(options => ({ ...options, group_by: selectedGB }));
    };

    const apply = () => {
      setOptions(options => {
        const newOptions = { ...options, ...localOptions, custom: true };
        if (newOptions.operation === 'none') {
          delete newOptions.operation;
          delete newOptions.group_by;
        }
        return newOptions;
      });
      hide();
    };

    return (
      <Popover
        placement={PopoverPlacement.BOTTOM}
        isVisible={visible}
        onRequestClose={hide}
        popoverStyle={{ padding: 15 }}
        from={
          <TouchableOpacity style={styles.button} onPress={resetAndShow}>
            <Text
              style={styles.smallText}
              content={
                operation === 'none'
                  ? CapitalizeFirst(t('log:operations.none_short'))
                  : CapitalizeFirst(t('log:operations.' + operation + '_short')) +
                    ' [' +
                    CapitalizeFirst(t('log:timeFrame.' + group_by + '_short')) +
                    ']'
              }
            />
          </TouchableOpacity>
        }>
        <Text content={CapitalizeFirst(t('log:infoText.configureAggregation'))} />
        <View style={theme.common.row}>
          <ModalDropdown
            style={styles.dropdownButtonInput}
            textStyle={styles.dropdownButtonText}
            defaultValue={`${CapitalizeFirst(t('log:operations.' + localOptions.operation))} (${t(
              'log:operations.' + localOptions.operation + '_short',
            )})`}
            options={OPERATIONS}
            renderButtonText={option => CapitalizeFirst(t('log:operations.' + option))}
            renderRow={(option, _, isSelected) => (
              <Text
                style={styles.dropdownText}
                content={`${CapitalizeFirst(t('log:operations.' + option))} (${t(
                  'log:operations.' + option + '_short',
                )})`}
                color={isSelected ? theme.variables.disabled : 'primary'}
              />
            )}
            onSelect={onChangeOperation}
          />
          {localOptions.operation !== 'none' && (
            <>
              <Text content={t('log:operationPostposition')} />
              <ModalDropdown
                style={styles.dropdownButtonInput}
                textStyle={styles.dropdownButtonText}
                defaultValue={CapitalizeFirst(t('log:timeFrame.' + localOptions.group_by))}
                options={GROUP_BY}
                renderButtonText={option => CapitalizeFirst(t('log:timeFrame.' + option))}
                renderRow={(option, _, isSelected) => (
                  <Text
                    style={styles.dropdownText}
                    content={CapitalizeFirst(t('log:timeFrame.' + option))}
                    color={isSelected ? theme.variables.disabled : 'primary'}
                  />
                )}
                onSelect={onChangeGroupBy}
              />
            </>
          )}
        </View>
        <Button
          disabled={disabled}
          onPress={apply}
          display="block"
          color="primary"
          text={CapitalizeFirst(t('genericButton.apply'))}
        />
      </Popover>
    );
  },
);

export default AggregationSelector;
