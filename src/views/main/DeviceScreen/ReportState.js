import React from 'react';
import { Image, Text as RNtext, StyleSheet, View } from 'react-native';
import { cannotAccessState, roundBasedOnStep } from 'wappsto-blanket';
import Text from '../../../components/Text';
import Timestamp from '../../../components/Timestamp';
import theme from '../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../translations';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  data: {
    fontSize: theme.variables.h3,
    fontWeight: '400',
  },
  text: {
    textAlign: 'center',
    marginBottom: 15,
  },
  textMargin: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const content = (state, value) => {
  if (value.hasOwnProperty('blob') && value.type === 'image') {
    if (state.data && state.data.length > 0) {
      return <Image style={styles.image} source={{ uri: state.data }} />;
    } else {
      return null;
    }
  } else if (value.hasOwnProperty('number')) {
    return (
      <RNtext style={styles.text}>
        <Text
          style={styles.data}
          content={roundBasedOnStep(state.data, value.number.step, value.number.min)}
        />
        <Text
          color="secondary"
          content={value.number && value.number.unit && ' ' + value.number.unit}
        />
      </RNtext>
    );
  } else {
    return (
      <RNtext style={styles.text}>
        <Text style={styles.data} content={state.data} />
      </RNtext>
    );
  }
};

const ReportState = React.memo(({ state, value }) => {
  const { t } = useTranslation();
  return (
    <View>
      <View style={styles.row}>
        <Text
          bold
          color="secondary"
          style={styles.textMargin}
          content={CapitalizeFirst(t('dataModel:stateProperties.reportState'))}
        />
        {!cannotAccessState(state) && <Timestamp timestamp={state.timestamp} />}
      </View>
      {cannotAccessState(state) ? (
        <Text
          content={CapitalizeFirst(
            t('dataModel:stateProperties.status_payment.' + state.status_payment),
          )}
        />
      ) : (
        content(state, value)
      )}
    </View>
  );
});

export default ReportState;
