import React, { useState, useEffect, useRef, useCallback } from 'react';
import Text from '../../../components/Text';
import GraphChart from './GraphChart';
import ChartHeader from './ChartHeader';
import LogComponent, { STATUS } from './LogComponent';
import { ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import useEntitySelector from 'wappsto-blanket/hooks/useEntitySelector';
import equal from 'deep-equal';
import { useTranslation, CapitalizeFirst } from '../../../translations';

const LogScreen = React.memo(() => {
  const { t } = useTranslation();
  const route = useRoute();
  const valueId = route.params?.id;
  const value = useEntitySelector('value', valueId);
  const [ loading, setLoading ] = useState(false);
  const [ data, setData ] = useState({});
  const [ options, setOptions ] = useState();
  const [ values, setValues ] = useState([]);
  const prevOptions = useRef(options);
  const cachedData = useRef({});
  const errors = useRef({});
  const hasReport = value?.permission?.includes('r');
  const hasControl = value?.permission?.includes('w');

  const onDone = useCallback((data) => {
    if(data.status === 'unmount'){
      delete cachedData.current[data.type];
      return;
    } else {
      cachedData.current[data.type] = data;
      if(data.status === STATUS.error){
        errors.current[data.type] = true;
      }
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
    if(!options || (!hasReport && !hasControl)){
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
    if(!rawOptions.start || !rawOptions.end || equal(rawOptions, prevOptions.current)){
      return;
    }
    errors.current = {};
    cachedData.current = {};
    prevOptions.current = rawOptions;
    setLoading(true);
    const values = [];
    if(hasReport){
      cachedData.current.Report = null;
      values.push(<LogComponent key='read' id={valueId} options={rawOptions} onDone={onDone} stateType='Report' onlyNumber={!options.isList} />);
    }
    if(hasControl){
      cachedData.current.Control = null;
      values.push(<LogComponent key='write' id={valueId} options={rawOptions} onDone={onDone} stateType='Control' onlyNumber={!options.isList} />);
    }
    setValues(values);
  }, [options, valueId, hasReport, hasControl, onDone]);

  return (
    <>
      {values}
      <ChartHeader options={options} setOptions={setOptions}>
        {loading && <ActivityIndicator color='red' />}
        {errors.current.Report && <Text color='error' content={CapitalizeFirst(t('failedToGetReportData'))}/>}
        {!loading && !errors.current.Report && hasReport && !data.Report?.data.length && <Text color='warning' content={CapitalizeFirst(t('noReportDataWarning'))}/>}
        {errors.current.Control && <Text color='error' content={CapitalizeFirst(t('failedToGetControlData'))}/>}
        {!loading && !errors.current.Control && hasControl && !data.Control?.data.length && <Text color='warning' content={CapitalizeFirst(t('noControlDataWarning'))}/>}
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
