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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  center: {
    justifyContent: 'center'
  },
  buttonRow:{
    paddingTop: 10
  },
  button: {
    minWidth: headerHeight,
    height: headerHeight,
    lineHeight: headerHeight,
    margin:5,
    paddingHorizontal: 8,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: 'white'
  },
  buttonDisabled: {
    backgroundColor: theme.variables.disabled
  },
  dropdownContainer:{
    height:'auto'
  },
  dropdownText:{
    width:'100%',
    height: headerHeight + 5,
    lineHeight: headerHeight + 5,
    paddingHorizontal: 10
  },
  dropdownButton:{
    flex: 1,
    backgroundColor: 'white',
    height: headerHeight
  },
  dropdownButtonInput: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    borderColor: theme.variables.borderColor,
    borderWidth: theme.variables.borderWidth
  },
  dropdownButtonText:{
    width:'100%',
    height: headerHeight,
    lineHeight: headerHeight,
    paddingHorizontal: 8
  },
  typeIconStyle: {
    padding: 15,
    paddingRight:20
  },
  typeIconSelected: {
    backgroundColor: 'grey'
  },
  chartContainer: {
   // backgroundColor: 'white'
  },
  liveCircle: {
    width: 8,
    height: 8,
    borderRadius: 8,
    marginRight: 5
  },
  liveOn: {
    backgroundColor: 'green'
  },
  liveOff: {
    backgroundColor: '#c9c9c9'
  }
});

const TYPES = ['clock', 'hash']; //, 'calendar'
const TIME_OPTIONS = [
  {t: 'log:lastOptions.lastXTimeFrame', number: 5, time: 'minute' },
  {t: 'log:lastOptions.lastXTimeFrame', number: 30, time: 'minute' },
  {t: 'log:lastOptions.lastXTimeFrame', number: 1, time: 'hour' },
  {t: 'log:lastOptions.lastXTimeFrame', number: 1, time: 'month' }
];
const POINT_OPTIONS = [50, 100, 300, 1000];

const OPERATIONS = ['none', 'avg', 'sum', 'count', 'max', 'min', 'stddev', 'variance', 'geometric_mean', 'arbitrary', 'sqrdiff'];
const GROUP_BY = ['microsecond', 'millisecond', 'second', 'minute', 'hour', 'day', 'week', 'month', 'quarter', 'year'];

export const MAX_POINTS = 1000;

const compute = ({ start, end }) => {
  if(!start || !end){
    return;
  }
  // diff in minutes
  const diff = (end.getTime() - start.getTime()) / (1000 * 60);
  if(diff <= 60){
    return [];
  } else if(diff <= 60 * 24){
    return ['minute', 'avg'];
  } else if(diff <= 60 * 24 * 7){
    return ['hour', 'avg'];
  } else if(diff <= 60 * 24 * 30 * 18) {
    return ['day', 'avg'];
  } else {
    return ['week', 'avg'];
  }
}

const getDateOptions = (time, number = 1, autoCompute) => {
  const options = { end: new Date() };
  switch(time){
    case 'minute':
      options.start = new Date();
      options.start.setMinutes(options.start.getMinutes() - number);
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'hour':
      options.start = new Date();
      options.start.setHours(options.start.getHours() - number);
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'day':
      options.start = new Date();
      options.start.setDate(options.start.getDate() - number);
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'week':
      options.start = new Date();
      options.start.setDate(options.start.getDate() - (7 * number));
      if(autoCompute){
        [options.group_by, options.operation] = compute(options);
      }
      break;
    case 'month':
      options.start = new Date();
      options.start.setMonth(options.start.getMonth() - number);
      if(autoCompute){
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
}

const getXValueOptions = (number, autoCompute) => {
  const start = (new Date('01/01/2010')).toISOString();
  const end = (new Date()).toISOString();
  const options = { start, end, limit: number, value: { number }, type: 'hash', order: 'descending' };
  if(autoCompute){
    options.operation = undefined;
    options.group_by = undefined;
  }
  return options;
}

const TypeSelector = React.memo(({ type, setOptions }) => {
  const onChangeType = (_, selectedType) => {
    setOptions((options) => options.type === selectedType ? options : {...options, type: selectedType, value: ''});
  }
  return (
    <ModalDropdown
      style={styles.button}
      dropdownStyle={[styles.dropdownContainer, {marginTop: 10}]}
      defaultValue={type}
      options={TYPES}
      renderRow={(option, _, isSelected) => <Icon size={15} name={option} style={[styles.typeIconStyle, isSelected && styles.typeIconSelected]}/>}
      onSelect={onChangeType}
    >
      <View style={styles.row}>
        <Icon size={15} name={type} style={{marginRight:5}}/>
        <Icon size={10} name='chevron-down'/>
      </View>
    </ModalDropdown>
  );
});

const TimeValue = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getDateOptions(selectedValue.time, selectedValue.number, autoCompute);
    setOptions((options) => {
      const n = {...options, ...newOptions, value: selectedValue, type: 'clock'};
      delete n.limit;
      delete n.order;
      return n;
    });
  }
  return (
    <ModalDropdown
      style={styles.dropdownButton}
      textStyle={styles.dropdownButtonText}
      dropdownStyle={styles.dropdownContainer}
      defaultValue={CapitalizeFirst(t(value?.t || 'select', { x: value?.number,  time: value?.time }))}
      defaultIndex={0}
      options={TIME_OPTIONS}
      onSelect={onChangeValue}
      renderButtonText={(option) => CapitalizeFirst(t(option.t, { x: option.number,  time: option.time }))}
      renderRow={(option, _, isSelected) => (
        <Text style={styles.dropdownText} content={CapitalizeFirst(t(option.t, { x: option.number, time: option.time }))} color={isSelected ? 'secondary' : 'primary'}/>
      )}
    />
  )
});

const LastXValue = React.memo(({ value, setOptions, autoCompute }) => {
  const { t } = useTranslation();
  const onChangeValue = (_, selectedValue) => {
    const newOptions = getXValueOptions(selectedValue, autoCompute);
    setOptions(options => ({...options, ...newOptions}));
  }
  return (
    <ModalDropdown
      style={styles.dropdownButton}
      textStyle={styles.dropdownButtonText}
      dropdownStyle={styles.dropdownContainer}
      defaultValue={CapitalizeFirst(t(value?.number ? 'log:lastOptions.lastXPoints' : 'select', { x: value.number }))}
      options={POINT_OPTIONS}
      onSelect={onChangeValue}
      renderButtonText={(option) => CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: option }))}
      renderRow={(option, _, isSelected) => (
        <Text style={styles.dropdownText} content={CapitalizeFirst(t('log:lastOptions.lastXPoints', { x: option }))} color={isSelected ? 'secondary' : 'primary'}/>
      )}
    />
  )
});

const CalendarValue = React.memo(({ value, setOptions }) => {
  return null;
});

const Compute = React.memo(({ operation = 'none', group_by = 'minute', setOptions }) => {
  const { t } = useTranslation();
  const [ visible, show, hide ] = useVisible(false);
  const [ localOptions, setLocalOptions ] = useState({ operation: operation || 'none', group_by: group_by || 'minute' });
  const disabled = (localOptions.operation !== 'none' && localOptions.group_by === 'none')
              || (localOptions.operation === operation && localOptions.group_by === group_by)
              || (localOptions.operation === 'none' && localOptions.group_by === 'none' && !operation && !group_by);

  const resetAndShow = () => {
    setLocalOptions({ operation: operation || 'none', group_by: group_by || 'minute' });
    show();
  }

  const onChangeOperation = (_, selectedOperation) => {
    setLocalOptions(options => ({...options, operation: selectedOperation, group_by: selectedOperation === 'none' ? 'minute' : options.group_by}));
  }

  const onChangeGroupBy = (_, selectedGB) => {
    setLocalOptions(options => ({...options, group_by: selectedGB}));
  }

  const apply = () => {
    setOptions(options => {
      const newOptions = {...options, ...localOptions, custom: true};
      if(newOptions.operation === 'none'){
        delete newOptions.operation;
        delete newOptions.group_by;
      }
      return newOptions;
    });
    hide();
  }
  
  return(
    <Popover
      placement={PopoverPlacement.BOTTOM}
      isVisible={visible}
      onRequestClose={hide}
      popoverStyle={{padding: 15}}
      from={
        <TouchableOpacity style={styles.button} onPress={resetAndShow}>
          <Text content={operation === 'none' ? CapitalizeFirst(t('log:operations.none_short')) : CapitalizeFirst(t('log:operations.' + operation + '_short')) + ' [' + CapitalizeFirst(t('log:timeFrame.' + group_by + '_short')) + ']'}/>
        </TouchableOpacity>
      }
    >
      <Text content={CapitalizeFirst(t('log:infoText.configureAggregation'))}/>
      <View style={theme.common.row}>
        <ModalDropdown
          style={styles.dropdownButtonInput}
          textStyle={styles.dropdownButtonText}
          defaultValue={localOptions.operation}
          options={OPERATIONS}
          renderButtonText={option => t(option)}
          renderRow={(option, _, isSelected) => (
            <Text style={styles.dropdownText} content={CapitalizeFirst(t('log:operations.' + option))} color={isSelected ? 'secondary' : 'primary'}/>
          )}
          onSelect={onChangeOperation}
        />
        {
          localOptions.operation !== 'none' &&
          <>
            <Text content={t('log:operationPostposition')}/>
            <ModalDropdown
              style={styles.dropdownButtonInput}
              textStyle={styles.dropdownButtonText}
              defaultValue={localOptions.group_by}
              options={GROUP_BY}
              renderButtonText={option => t(option)}
              renderRow={(option, _, isSelected) => (
                <Text style={styles.dropdownText} content={CapitalizeFirst(t('log:timeFrame.' + option))} color={isSelected ? 'secondary' : 'primary'}/>
              )}
              onSelect={onChangeGroupBy}
            />
          </>
        }
      </View>
      <Button
        disabled={disabled}
        onPress={apply}
        display='block'
        color='primary'
        text={CapitalizeFirst(t('apply'))}
      />
    </Popover>
  )
});

const defaultOptions = {
  type: TYPES[0],
  value: TIME_OPTIONS[0]
};
const ChartHeader = ({ options, setOptions, children}) => {
  const { t } = useTranslation();
  const disabled = true;
  useEffect(() => {
    if(!options){
      const dates = getDateOptions(defaultOptions.value.time, defaultOptions.value.number, true);
      setOptions({...defaultOptions, ...dates});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!options){
    return null
  }

  const toggleLive = () => {
    setOptions({...options, live: !options.live});
  }

  const setArrowOptions = (newOptions, number) => {
    setOptions({...defaultOptions, ...newOptions, value: { ...options.value, number }});
  }

  let ValueComponent = null;
  let handleLeft, handleRight, leftDisabled, rightDisabled;
  switch(options.type){
    case 'clock':{
      ValueComponent = TimeValue;
      const diff = 1;
      const leftDiff = options.value.number + diff;
      const rightDiff = options.value.number - diff;
      switch(options.value.time){
        case 'minute':
          leftDisabled = leftDiff === 60;
          break;
        case 'hour':
          leftDisabled = leftDiff === 24;
          break;
        case 'day':
          leftDisabled = leftDiff === 7;
          break;
        case 'week':
          leftDisabled = leftDiff === 4;
          break;
        case 'month':
          leftDisabled = leftDiff === 2;
          break;
        default:
          leftDisabled = leftDiff === 1;
      }
      rightDisabled = rightDiff === 0;
      handleLeft = () => {
        const newOptions = getDateOptions(options.value.time, leftDiff, !options.custom);
        setArrowOptions(newOptions, leftDiff);
      }
      handleRight = () => {
        const newOptions = getDateOptions(options.value.time, rightDiff, !options.custom);
        setArrowOptions(newOptions, rightDiff);
      }
      break;
    }
    case 'hash':{
      ValueComponent = LastXValue;
      const diff = 10;
      const leftDiff = options.value.number + diff;
      const rightDiff = options.value.number - diff;
      leftDisabled = leftDiff > MAX_POINTS;
      rightDisabled = rightDiff === 0;
      handleLeft = () => {
        const newOptions = getXValueOptions(leftDiff);
        setArrowOptions(newOptions, leftDiff);
      }
      handleRight = () => {
        const newOptions = getXValueOptions(rightDisabled);
        setArrowOptions(newOptions, rightDiff);
      }
      break;
    }
    case 'calendar':
      ValueComponent = CalendarValue;
      break;
  }

  return (
    <View>
      <View style={[styles.row, styles.buttonRow]}>
        {
          !options.live &&
            <>
              <TypeSelector type={options.type} setOptions={setOptions}  />
              <ValueComponent value={options.value} setOptions={setOptions} autoCompute={!options.custom} />
              <Compute operation={options.operation} group_by={options.group_by} setOptions={setOptions}/>
            </>
        }
        <TouchableOpacity style={[theme.common.row, styles.button, options.live ? {flex:1} : {}]} onPress={toggleLive}>
          <View style={[styles.liveCircle, options.live ? styles.liveOn : styles.liveOff]}/>
          <Text content={CapitalizeFirst(t('log:liveDataButton'))} />
        </TouchableOpacity>
      </View>

      {
        !options.live &&!!options.value && !disabled &&
          <View style={[theme.common.row, styles.center]}>
            <TouchableOpacity style={[styles.button, leftDisabled && styles.buttonDisabled]} onPress={handleLeft} disabled={leftDisabled}>
              <Icon name='chevron-left'/>
            </TouchableOpacity>
            <Text content={CapitalizeFirst(t(options.type === 'clock' ? options.value.t : 'log:lastOptions.lastXPoints', { x: options.value.number }))}/>
            <TouchableOpacity style={[styles.button, rightDisabled && styles.buttonDisabled]} onPress={handleRight} disabled={rightDisabled}>
              <Icon name='chevron-right'/>
            </TouchableOpacity>
          </View>
      }
      <View style={styles.chartContainer}>
        {children}
      </View>
    </View>
  );
};

export default ChartHeader;
