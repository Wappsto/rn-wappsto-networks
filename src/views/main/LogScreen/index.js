import React, { useState, useEffect, useRef, useCallback } from 'react';
import GraphChart from './GraphChart';
import ChartHeader from './ChartHeader';
import LogComponent, { STATUS } from './LogComponent';
import { ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useEntitySelector from 'wappsto-blanket/hooks/useEntitySelector';
import equal from 'deep-equal';

const LogScreen = React.memo(() => {
  const route = useRoute();
  const valueId = route.params?.id;
  const value = useEntitySelector('value', valueId);
  const permission = value?.permission || '';
  const [ loading, setLoading ] = useState(false);
  const [ data, setData ] = useState({});
  const [ options, setOptions ] = useState();
  const [ values, setValues ] = useState([]);
  const prevOptions = useRef(options);
  const cachedData = useRef({});

  const onDone = useCallback((data) => {
    if(data.status === 'unmount'){
      delete cachedData.current[data.type];
      return;
    } else {
      cachedData.current[data.type] = data;
    }
    for(let key in cachedData.current){
      if(!cachedData.current[key]){
        return;
      }
    }
    setLoading(false);
    setData(cachedData.current);
  }, []);

  useEffect(() => {
    if(!options){
      return;
    }
    const rawOptions = {
      start: options.start,
      end: options.end,
    };
    if(options.operation){
      rawOptions.operation = options.operation;
    }
    if(options.group_by){
      rawOptions.group_by = options.group_by;
    }
    if(options.limit){
      rawOptions.limit = options.limit;
    }
    if(!rawOptions.start || !rawOptions.end || equal(rawOptions, prevOptions)){
      return;
    }
    setLoading(true);
    cachedData.current = {};
    prevOptions.current = rawOptions;
    const values = [];
    if(permission.includes('r')){
      cachedData.current.Report = null;
      values.push(<LogComponent key='read' id={valueId} options={rawOptions} onDone={onDone} stateType='Report' onlyNumber={!options.isList} />);
    }
    if(permission.includes('w')){
      cachedData.current.Control = null;
      values.push(<LogComponent key='write' id={valueId} options={rawOptions} onDone={onDone} stateType='Control' onlyNumber={!options.isList} />);
    }
    setValues(values);
  }, [options, valueId, permission, onDone]);

  return (
    <>
      {values}
      <ChartHeader options={options} setOptions={setOptions}>
        {loading && <ActivityIndicator color='red' />}
        <GraphChart data={data} operation={options?.operation}/>
      </ChartHeader>
    </>
  )
});

LogScreen.navigationOptions = ({ route }) => {
  return {
    title: route.params.title || '',
  };
};

export default LogScreen;
