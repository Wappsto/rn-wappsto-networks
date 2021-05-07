import React, { useMemo, useState, useRef, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { VictoryChart, VictoryVoronoiContainer, VictoryScatter, VictoryTheme, VictoryLine, createContainer } from 'victory-native';
import Button from '../../../components/Button';
import Text from '../../../components/Text';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import theme from '../../../theme/themeExport';
import equal from 'deep-equal';

// const VictoryZoomVoronoiContainer = createContainer('zoom', 'voronoi');
const styles = StyleSheet.create({
  colorBox: {
    width: 14,
    height: 14,
    margin: 8
  },
  selected: {
    opacity: 0.3
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const COLORS = {
  Report: theme.variables.primary,
  Control: theme.variables.secondary
}

const GraphChart = React.memo(({ data, operation = 'data', setCanScroll }) => {
  const { t } = useTranslation();
  const [ hidden, setHidden ] = useState([]);
  const [ zoom, setZoom ] = useState();
  const xyCache = useRef({});

  const resetZoom = useCallback(() => setZoom(xyCache.current), []);

  const formattedData = useMemo(() => {
    const fd = [];
    const x = [];
    const y = [];
    for(let key in data){
        const props = {
          key,
          data: data[key].data.map(d => {
            const time = new Date(d.time);
            const data = d[operation] && !isNaN(d[operation]) ? parseFloat(d[operation]) : null;
            if(!x[0] || time.getTime() < x[0].getTime()){
              x[0] = time;
            }
            if(!x[1] || time.getTime() > x[1].getTime()){
              x[1] = time;
            }
            if(data !== null){
              if(!y[0] || data < y[0]){
                y[0] = data;
              }
              if(!y[1] || data > y[1]){
                y[1] = data;
              }
            }
            return { x: time, y: data, rawValue: d[operation] };
          }),
          name: data[key].name
        }
        fd.push(props);
    }
    if(x.length && y.length){
      xyCache.current = { x, y };
      resetZoom();
    }
    return fd;
  }, [data, operation, resetZoom]);

  // const scale = { x: 'time', y: 'linear' };
  const [lines, legend] = useMemo(() => {
    const lines = [];
    const legend = [];
    formattedData.forEach(({ key, name, ...props }) => {
      const isHidden = hidden.includes(key);
      if(!isHidden && props.data.length){
        lines.push([
          <VictoryLine key={key + '_line'} name={key + '_line'} {...props} style={{data: { stroke: COLORS[key] }}}/>,
          <VictoryScatter key={key + '_points'} name={name} {...props} style={{data: {fill: COLORS[key]} }}/>
        ]);
      }
      legend.push(
        <TouchableOpacity key={key} onPress={() => setHidden(h => isHidden ? h.filter(k => k !== key) : [...h, key] )}>
          <View style={[theme.common.row, isHidden && styles.selected]}>
            <View style={[styles.colorBox, { backgroundColor: COLORS[key] }]}/>
            <Text content={name} />
          </View>
        </TouchableOpacity>
      );
    })
    return [lines, legend];
  }, [formattedData, hidden]);

  const cannotZoom = !lines.length || equal(xyCache.current, zoom);
  return (
    <View style={styles.container}>
      {/*
        <Button
          disabled={cannotZoom}
          style={cannotZoom && theme.common.disabled}
          onPress={resetZoom}
          display='block'
          color='primary'
          text={CapitalizeFirst(t('resetZoom'))}
        />
      */}
      <VictoryChart
        scale={{ x: 'time' }}
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            voronoiBlacklist={['Report_line', 'Control_line']}
            labels={d => [`${d.datum.childName}: ${d.datum.rawValue} (${d.datum.x.toLocaleString()})`]}
          />
        }
      >
        {lines}
      </VictoryChart>
      <View style={theme.common.row}>{legend}</View>
    </View>
  );
});

export default GraphChart;
