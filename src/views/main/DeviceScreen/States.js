import React, { useMemo, useCallback } from 'react';
import {View, ActivityIndicator} from 'react-native';
import Text from '../../../components/Text';
import { useSelector } from 'react-redux';
import ControlState from './ControlState';
import ReportState from './ReportState';
import RequestError from '../../../components/RequestError';
import { makeEntitiesSelector } from 'wappsto-redux/selectors/entities';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import useRequest from 'wappsto-blanket/hooks/useRequest';

const StatesComponent = React.memo(({ value }) => {
  const { t } = useTranslation();
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
  const haveReportState = reportState && reportState.meta && !reportState.meta.error;
  const haveControlState = controlState && controlState.meta && !controlState.meta.error;

  return (
    <View>
      {states.length !== 0 ? (
        <>
          <View style={{padding:15}}>
            {haveReportState && <ReportState value={value} state={reportState} />}
            {haveReportState && haveControlState && <View style={theme.common.seperator} />}
            {haveControlState && <ControlState value={value} state={controlState} />}
          </View>
        </>
      ) : (
        <Text
          size='p'
          color='secondary'
          align='center'
          content={CapitalizeFirst(t('noData'))}
          style={theme.common.spaceAround}
        />
      )}
      {request && request.status === 'pending' && (
        <ActivityIndicator size='large' color={theme.variables.spinnerColor} />
      )}
      <RequestError request={request} />
    </View>
  );
});

export default StatesComponent;
