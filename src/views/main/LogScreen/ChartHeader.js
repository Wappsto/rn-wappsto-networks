import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Popover, { PopoverPlacement } from 'react-native-popover-view';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import useVisible from 'wappsto-blanket/hooks/useVisible';

const headerHeight = 35;
const styles = StyleSheet.create({
  typeSelectionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 9,
    height: headerHeight,
    marginHorizontal: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  button: {
    minWidth: headerHeight,
    height: headerHeight,
    lineHeight: headerHeight,
    margin: 5,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  buttonDisabled: {
    backgroundColor: theme.variables.disabled,
  },
  textDisabled: {
    color: theme.variables.disabled,
  },
  dropdownContainer: {
    height: 'auto',
    borderColor: '#ccc',
    marginTop: -1,
    borderWidth: 1,
  },
  dropdownText: {
    width: '100%',
    height: headerHeight + 5,
    lineHeight: headerHeight + 5,
    paddingHorizontal: 10,
  },
  dropdownButton: {
    flex: 1,
    backgroundColor: 'white',
    height: headerHeight,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dropdownButtonInput: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    borderColor: theme.variables.borderColor,
    borderWidth: theme.variables.borderWidth,
  },
  dropdownButtonText: {
    width: '100%',
    height: headerHeight,
    lineHeight: headerHeight,
    paddingHorizontal: 8,
  },
  typeIconStyle: {
    padding: 15,
    paddingRight: 20,
  },
  chartContainer: {
    marginBottom: 30,
  },
  liveCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  liveOn: {
    backgroundColor: 'green',
  },
  liveOff: {
    backgroundColor: '#c9c9c9',
  },
  smallText: {
    fontSize: 12,
  },
});

const TYPES = ['hash', 'clock'];
const TIME_OPTIONS = [
  { number: 15, time: 'minute' },
  { number: 1, time: 'hour' },
  { number: 6, time: 'hour' },
  { number: 1, time: 'day' },
  { number: 1, time: 'week' },
  { number: 1, time: 'month' },
];
const POINT_OPTIONS = [25, 50, 100, 250, 500];

const OPERATIONS = [
  'none',
  'avg',
  'sum',
  'count',
  'max',
  'min',
  'stddev',
  'variance',
  'geometric_mean',
  'arbitrary',
  'sqrdiff',
];
const GROUP_BY = [
  'microsecond',
  'millisecond',
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
];

export const MAX_POINTS = 1000;

const compute = ({ start, end }) => {
  if (!start || !end) {
    return;
  }
  // diff in minutes
  const diff = (end.getTime() - start.getTime()) / (1000 * 60);
  if (diff <= 60) {
    return [];
  } else if (diff <= 60 * 24) {
    return ['minute', 'avg'];
  } else if (diff <= 60 * 24 * 7) {
    return ['hour', 'avg'];
  } else if (diff <= 60 * 24 * 30 * 18) {
    return ['day', 'avg'];
  } else {
    return ['week', 'avg'];
  }
};

const getDateOptions = (time, number = 1, arrowClick = 0, autoCompute) => {
  const options = { end: new Date(), start: new Date() };
  switch (time) {
    case 'minute':
      options.end.setMinutes(options.start.getMinutes() - number * arrowClick);
      options.start.setMinutes(options.start.getMinutes() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'hour':
      options.end.setHours(options.start.getHours() - number * arrowClick);
      options.start.setHours(options.start.getHours() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'day':
      options.end.setDate(options.start.getDate() - number * arrowClick);
      options.start.setDate(options.start.getDate() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'week':
      options.end.setDate(options.start.getDate() - 7 * number * arrowClick);
      options.start.setDate(options.start.getDate() - 7 * number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'month':
      options.end.setMonth(options.start.getMonth() - number * arrowClick);
      options.start.setMonth(options.start.getMonth() - number * (arrowClick + 1));
      if (autoCompute) {
        [options.group_by, options.operation] = compute(options);
      }
      break;
    default:
      break;
  }
  options.start.setMilliseconds(0);
  options.end.setMilliseconds(0);
  options.order = 'descending';
  return options;
};

const getXValueOptions = (number, arrowClick = 0, autoCompute) => {
  const start = new Date('01/01/2010').toISOString();
  const end = new Date().toISOString();
  const options = {
    start,
    end,
    limit: number,
    offset: number * arrowClick,
    value: { number },
    type: 'hash',
    order: 'descending',
  };
  if (autoCompute) {
    options.operation = undefined;
    options.group_by = undefined;
  }
  return options;
};

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

const TimeValue = React.memo(({ value, setOptions, autoCompute }) => {
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

const LastXValue = React.memo(({ value, setOptions, autoCompute }) => {
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

const Compute = React.memo(({ operation = 'none', group_by = 'minute', setOptions }) => {
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
    setLocalOptions((options) => ({
      ...options,
      operation: selectedOperation,
      group_by: selectedOperation === 'none' ? 'minute' : options.group_by,
    }));
  };

  const onChangeGroupBy = (_, selectedGB) => {
    setLocalOptions((options) => ({ ...options, group_by: selectedGB }));
  };

  const apply = () => {
    setOptions((options) => {
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
          renderButtonText={(option) => CapitalizeFirst(t('log:operations.' + option))}
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
              renderButtonText={(option) => CapitalizeFirst(t('log:timeFrame.' + option))}
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
});

const defaultOptions = {
  type: TYPES[0],
  value: {
    number: POINT_OPTIONS[0],
  },
};
const ChartHeader = ({ options, setOptions, children }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (!options) {
      let newOptions;
      switch (defaultOptions.type) {
        case 'clock':
          newOptions = getDateOptions(
            defaultOptions.value.time,
            defaultOptions.value.number,
            0,
            true,
          );
          break;
        case 'hash':
        default:
          newOptions = getXValueOptions(defaultOptions.value.number, 0, true);
          break;
      }
      setOptions({
        ...defaultOptions,
        ...newOptions,
        value: { ...defaultOptions.value },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!options) {
    return null;
  }

  const toggleLive = () => {
    setOptions({ ...options, live: !options.live });
  };

  let ValueComponent = null;
  let handleLeft, handleRight;
  const rightDisabled = !options.value.arrowClick;
  const leftDisabled = options.value.arrowClick === 10;
  switch (options.type) {
    case 'clock': {
      ValueComponent = TimeValue;
      handleLeft = () => {
        const arrowClick = (options.value.arrowClick || 0) + 1;
        const newOptions = getDateOptions(
          options.value.time,
          options.value.number,
          arrowClick,
          !options.custom,
        );
        setOptions({
          ...options,
          ...newOptions,
          value: { ...options.value, arrowClick },
        });
      };
      handleRight = () => {
        const arrowClick = (options.value.arrowClick || 0) - 1;
        const newOptions = getDateOptions(
          options.value.time,
          options.value.number,
          arrowClick,
          !options.custom,
        );
        setOptions({
          ...options,
          ...newOptions,
          value: { ...options.value, arrowClick },
        });
      };
      break;
    }
    case 'hash': {
      ValueComponent = LastXValue;
      handleLeft = () => {
        const arrowClick = (options.value.arrowClick || 0) + 1;
        const newOptions = getXValueOptions(options.value.number, arrowClick, !options.custom);
        setOptions({
          ...options,
          ...newOptions,
          value: { ...options.value, arrowClick },
        });
      };
      handleRight = () => {
        const arrowClick = (options.value.arrowClick || 0) - 1;
        const newOptions = getXValueOptions(options.value.number, arrowClick, !options.custom);
        setOptions({
          ...options,
          ...newOptions,
          value: { ...options.value, arrowClick },
        });
      };
      break;
    }
    default:
      break;
  }

  return (
    <View>
      <View style={styles.header}>
        {!options.live && (
          <>
            <TypeSelector type={options.type} setOptions={setOptions} />
            {!!options.value && (
              <TouchableOpacity
                style={[styles.button, { marginRight: -1 }]}
                onPress={handleLeft}
                disabled={leftDisabled}>
                <View style={[theme.common.row]}>
                  <Icon size={15} name="arrow-left" style={leftDisabled && styles.textDisabled} />
                </View>
              </TouchableOpacity>
            )}
            <ValueComponent
              value={options.value}
              setOptions={setOptions}
              autoCompute={!options.custom}
            />
            {!!options.value && (
              <TouchableOpacity
                style={[styles.button, { marginLeft: -1 }]}
                onPress={handleRight}
                disabled={rightDisabled}>
                <View style={theme.common.row}>
                  <Icon size={15} name="arrow-right" style={rightDisabled && styles.textDisabled} />
                </View>
              </TouchableOpacity>
            )}
            <Compute
              operation={options.operation}
              group_by={options.group_by}
              setOptions={setOptions}
            />
          </>
        )}
        <TouchableOpacity
          style={[theme.common.row, styles.button, options.live && { flex: 1 }]}
          onPress={toggleLive}>
          <View style={[styles.liveCircle, options.live ? styles.liveOn : styles.liveOff]} />
          <Text style={styles.smallText} content={CapitalizeFirst(t('log:liveDataButton'))} />
        </TouchableOpacity>
      </View>
      <View style={styles.chartContainer}>{children}</View>
    </View>
  );
};

export default ChartHeader;
