import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryScatter,
  VictoryTheme,
  VictoryVoronoiContainer,
} from 'victory-native';
import Text from '../../../components/Text';
import theme from '../../../theme/themeExport';

dayjs.extend(LocalizedFormat);

// const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');
const styles = StyleSheet.create({
  colorBox: {
    width: 14,
    height: 14,
    margin: 8,
  },
  selected: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});

const COLORS = {
  Report: theme.variables.primary,
  Control: theme.variables.secondary,
};

const DATE_FORMAT = 'lll';

const GraphChart = React.memo(({ data, operation = 'data', reverseOrder }) => {
  const [hidden, setHidden] = useState([]);
  const [dates, setDates] = useState();

  const formattedData = useMemo(() => {
    const fd = [];
    for (let key in data) {
      const props = {
        key,
        data: data[key].data.map(d => {
          const time = new Date(d.time);
          const data =
            d[operation] && !d[operation].includes('nfinity') && !isNaN(d[operation])
              ? parseFloat(d[operation])
              : null;
          return { x: time, y: data };
        }),
        name: data[key].name,
      };
      fd.push(props);
    }
    return fd;
  }, [data, operation]);

  // const scale = { x: 'time', y: 'linear' };
  const [lines, legend] = useMemo(() => {
    const lines = [];
    const legend = [];
    formattedData.forEach(({ key, name, ...props }) => {
      const isHidden = hidden.includes(key);
      if (!isHidden && props.data.length) {
        lines.push([
          <VictoryLine
            key={key + '_line'}
            name={key + '_line'}
            {...props}
            style={{ data: { stroke: COLORS[key] } }}
          />,
          <VictoryScatter
            key={key + '_points'}
            name={name}
            {...props}
            style={{ data: { fill: COLORS[key] } }}
          />,
        ]);
      }
      legend.push(
        <TouchableOpacity
          key={key}
          onPress={() => setHidden(h => (isHidden ? h.filter(k => k !== key) : [...h, key]))}>
          <View style={[theme.common.row, isHidden && styles.selected]}>
            <View style={[styles.colorBox, { backgroundColor: COLORS[key] }]} />
            <Text content={name} />
          </View>
        </TouchableOpacity>,
      );
    });
    return [lines, legend];
  }, [formattedData, hidden]);

  useEffect(() => {
    if (formattedData.length > 0 && formattedData[0].data.length > 2) {
      const data = formattedData[0].data;
      const date1 = dayjs(data[0].x).format(DATE_FORMAT);
      const date2 = dayjs(data[data.length - 1].x).format(DATE_FORMAT);
      if (reverseOrder) {
        setDates(date2 + ' - ' + date1);
      } else {
        setDates(date1 + ' - ' + date2);
      }
    } else {
      setDates();
    }
  }, [formattedData, reverseOrder]);

  return (
    <View style={styles.container}>
      {dates && <Text content={dates} color="secondary" />}
      <VictoryChart
        scale={{ y: 'linear', x: 'time' }}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiBlacklist={['Report_line', 'Control_line']}
            labels={d => {
              if (d.datum.y !== null) {
                return [
                  `${d.datum.childName}: ${d.datum.y}\n\n ${dayjs(d.datum.x).format(DATE_FORMAT)}`,
                ];
              }
            }}
          />
        }>
        {lines}
      </VictoryChart>
      <View style={theme.common.row}>{legend}</View>
    </View>
  );
});

GraphChart.displayName = 'GraphChart';
export default GraphChart;
