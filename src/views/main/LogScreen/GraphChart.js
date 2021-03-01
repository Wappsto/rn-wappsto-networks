import React, { useMemo, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory-native';
import theme from '../../../theme/themeExport';

const styles = StyleSheet.create({
  colorBox: {
    width: 20,
    height: 20,
    margin: 20
  },
  selected: {
    opacity: 0.3
  }
});
const COLORS = {
  Report: 'red',
  Control: 'green'
}
const GraphChart = React.memo(({ data, operation = 'data' }) => {
  const [ filter, setFilter ] = useState([]);
  const formattedData = useMemo(() => {
    const fd = [];
    for(let key in data){
        const props = {
          key,
          data: data[key].data.map(d => ({ x: new Date(d.time), y: d[operation] && !isNaN(d[operation]) ? parseFloat(d[operation]) : null })),
          name: data[key].name,
          style: {
            data: { stroke: COLORS[key] }
          }
        }
        fd.push(props);
    }
    return fd;
  }, [data, operation]);

  // const scale = { x: 'time', y: 'linear' };
  const [lines, legend] = useMemo(() => {
    const lines = [];
    const legend = [];
    formattedData.forEach((props) => {
      const { key, name } = props;
      if(!filter.includes(key)){
        lines.push(<VictoryLine {...props}/>);
      }
      const inFilter = filter.includes(key);
      legend.push(
        <TouchableOpacity key={key} onPress={() => setFilter(f => inFilter ? f.filter(k => k !== key) : [...f, key] )}>
          <View style={[theme.common.row, inFilter && styles.selected]}>
            <View style={[styles.colorBox, { backgroundColor: COLORS[key] }]}/>
            <Text>{name}</Text>
          </View>
        </TouchableOpacity>
      )
    })
    return [lines, legend];
  }, [formattedData, filter]);

  return (
    <>
      <VictoryChart
        theme={VictoryTheme.material}
      >
        {lines}
      </VictoryChart>
      <View style={theme.common.row}>{legend}</View>
    </>
  );
});

export default GraphChart;
