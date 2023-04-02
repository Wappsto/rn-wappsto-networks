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
import TimeDropdown from './TimeDropdown';
import TypeSelector from './TypeSelector';
import styles from './styles';

const defaultOptions = {
  type: TYPES[0],
  value: {
    number: POINT_OPTIONS[0],
  },
};
const ChartHeader = ({ options, setOptions, isLoading }) => {
  const { t } = useTranslation();
  useEffect(() => {
    if (!options) {
      let newOptions;
      switch (defaultOptions.type) {
        case 'timeBased':
          newOptions = getDateOptions(
            defaultOptions.value.time,
            defaultOptions.value.number,
            0,
            true,
          );
          break;
        case 'pointBased':
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
    case 'timeBased': {
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
    case 'pointBased': {
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
            <ValueComponent
              value={options.value}
              setOptions={setOptions}
              autoCompute={!options.custom}
            />
            {!!options.value && (
              <>
                <TouchableOpacity
                  style={[styles.button, { marginRight: -1 }]}
                  onPress={handleLeft}
                  disabled={leftDisabled || isLoading}>
                  <View style={[theme.common.row]}>
                    <Icon
                      size={15}
                      name="arrow-left"
                      color={leftDisabled ? theme.variables.disabled : theme.variables.textColor}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { marginLeft: -1 }]}
                  onPress={handleRight}
                  disabled={rightDisabled || isLoading}>
                  <View style={theme.common.row}>
                    <Icon
                      size={15}
                      name="arrow-right"
                      color={rightDisabled ? theme.variables.disabled : theme.variables.textColor}
                    />
                  </View>
                </TouchableOpacity>
              </>
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
