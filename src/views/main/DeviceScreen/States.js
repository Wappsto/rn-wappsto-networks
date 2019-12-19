import React, { useMemo, useCallback } from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import { useSelector } from 'react-redux';
import ControlState from './ControlState';
import ReportState from './ReportState';
import RequestError from '../../../components/RequestError';
import { makeEntitiesSelector } from 'wappsto-redux/selectors/entities';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst } from '../../../translations';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const StatesComponent = React.memo(({ value }) => {
  const id = value.meta.id;
  const url = '/value/' + id + '/state';
  const { request, send } = useRequest();
  const getEntities = useMemo(makeEntitiesSelector, []);
  const states = useSelector(state => getEntities(state, 'state', {parent: {type: 'value', id: id}}));

  const refresh = useCallback(() => {
    if (!request || request.status !== 'pending') {
      send({
        method: 'GET',
        url: url,
        query: {
          expand: 0
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request, url]);

  const reportState = states.find(s => s.type === 'Report');
  const controlState = states.find(s => s.type === 'Control');

  return (
    <View>
      {states.length !== 0 ? (
        <>
          <View style={theme.common.itemContent}>
            {reportState ? (
              <View>
                <ReportState value={value} state={reportState} />
                <Text style={theme.common.timestamp}>
                  {CapitalizeFirst(i18n.t('lastUpdated'))}:{' '}
                  {new Date(reportState.timestamp).toLocaleString()}
                </Text>
              </View>
            ) : null}
            {reportState && controlState ? (
              <View style={theme.common.seperator} />
            ) : null}
            {controlState ? (
              <View>
                <ControlState value={value} state={controlState} />
                <Text style={theme.common.timestamp}>
                  {CapitalizeFirst(i18n.t('lastUpdated'))}:{' '}
                  {new Date(controlState.timestamp).toLocaleString()}
                </Text>
              </View>
            ) : null}
          </View>
        </>
      ) : (
        <Text style={[theme.common.infoText, theme.common.secondary]}>
          {CapitalizeFirst(i18n.t('infoMessage.valueIsEmpty'))}
        </Text>
      )}
      {request && request.status === 'pending' && (
        <ActivityIndicator size='large' />
      )}
      <RequestError request={request} />
    </View>
  );
});

export default StatesComponent;
