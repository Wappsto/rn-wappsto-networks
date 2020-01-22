import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst } from '../../../translations';
import Timestamp from './Timestamp';

const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
  unit: {
    color: theme.variables.darkGray,
  },
  data: {
    fontSize: theme.variables.h3,
    fontWeight: '400',
  },
});

const content = (state, value) => {
  if (value.hasOwnProperty('blob') && value.type === 'image') {
    if (state.data && state.data.length > 0) {
      return <Image style={styles.image} source={{uri: state.data}} />;
    } else {
      return null;
    }
  } else {
    return (
      <Text style={{textAlign: 'center', marginBottom: 15}}>
        <Text style={styles.data}>{state.data}</Text>{' '}
        <Text style={styles.unit}>{value.number && value.number.unit}</Text>
      </Text>
    );
  }
};

const ReportState = React.memo(({ state, value }) => {
  if(state.status_payment === 'not_shared' || state.status_payment === 'not_paid'){
    return(
      <Text>
        {CapitalizeFirst(i18n.t('cannotRead'))}
      </Text>
    );
  }
  return (
    <View>
      <Text style={theme.common.H6}>
        {CapitalizeFirst(i18n.t('currentState'))}
      </Text>
      {content(state, value)}
      <Timestamp timestamp={state.timestamp}/>
    </View>
  );
});

export default ReportState;
