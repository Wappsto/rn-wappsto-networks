import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../../../components/Text';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';
import { getDateOptions, getXValueOptions } from './../helpers';
import { POINT_OPTIONS, TYPES } from './../params';
import AggregationSelector from './AggregationSelector';
import PointDropdown from './PointDropdown';
import styles from './styles';
import TimeDropdown from './TimeDropdown';
import TypeSelector from './TypeSelector';

const defaultOptions = {
  type: TYPES[0],
  value: {
    number: POINT_OPTIONS[0],
  },
};
const ChartHeader = ({ options, setOptions }) => {
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
      ValueComponent = TimeDropdown;
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
      ValueComponent = PointDropdown;
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
            <AggregationSelector
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
    </View>
  );
};

export default ChartHeader;
