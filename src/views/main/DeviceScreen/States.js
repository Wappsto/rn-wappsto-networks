import React, { useMemo } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import { makeEntitiesSelector } from 'wappsto-redux';
import Text from '../../../components/Text';
import theme from '../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../translations';
import ControlState from './ControlState';
import ReportState from './ReportState';

const StatesComponent = React.memo(({ value }) => {
  const { t } = useTranslation();
  const id = value.meta.id;
  const getEntities = useMemo(makeEntitiesSelector, []);
  const states = useSelector(state =>
    getEntities(state, 'state', { parent: { type: 'value', id: id } }),
  );

  if (states.length === 0) {
    return (
      <Text
        size="p"
        color="secondary"
        align="center"
        content={CapitalizeFirst(t('noData'))}
        style={theme.common.spaceAround}
      />
    );
  }
  const reportState = states.find(s => s.type === 'Report');
  const controlState = states.find(s => s.type === 'Control');
  const haveReportState = reportState && reportState.meta && !reportState.meta.error;
  const haveControlState = controlState && controlState.meta && !controlState.meta.error;

  return (
    <View style={{ padding: 15 }}>
      {haveReportState && <ReportState value={value} state={reportState} />}
      {haveReportState && haveControlState && <View style={theme.common.seperator} />}
      {haveControlState && <ControlState value={value} state={controlState} />}
    </View>
  );
});

StatesComponent.displayName = 'StatesComponent';
export default StatesComponent;
