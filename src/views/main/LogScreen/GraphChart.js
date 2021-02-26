import React, { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const COLORS = {
  Report: (opacity) => `rgba(0, 255, 0, ${opacity})`,
  Control: (opacity) => `rgba(255, 0, 0, ${opacity})`
}
const GraphChart = React.memo(({ data, operation = 'data' }) => {
  const [ labels, setLabels ] = useState([]);
  const [ datasets, setDatasets ] = useState([]);

  useEffect(() => {
    const labels = [];
    const datasets = [];
    for(let key in data){
      const keySet = { color: COLORS[key], data: [] };
      datasets.push(keySet);
      data[key].data.forEach(data => {
        const time = data.time;
        const value = data[operation];
        labels.push(time);
        keySet.data.push(value);
      });
    }
    setLabels(labels);
    setDatasets(datasets);
  }, [data, operation]);

  if(!labels.length || !datasets.length){
    return null;
  }
  return (
    <LineChart
      data={{
        labels: labels,
        datasets: datasets
      }}
      width={Dimensions.get('window').width} // from react-native
      height={220}
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16
        }
      }}
      bezier
      style={{
        borderRadius: 16
      }}
  />
  );
});

export default GraphChart;
