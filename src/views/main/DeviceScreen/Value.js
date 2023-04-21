import React, { useCallback } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRequest } from 'wappsto-blanket';
import Button from '../../../components/Button';
import RequestError from '../../../components/RequestError';
import Text from '../../../components/Text';
import theme from '../../../theme/themeExport';
import States from './States';
import ValueDetails from './ValueDetails';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  itemPanel: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: theme.variables.panelBgColor,
    borderRadius: theme.variables.borderRadiusBase,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomColor: theme.variables.lightGray,
    borderBottomWidth: theme.variables.borderWidth,
  },
  itemHeaderText: {
    marginBottom: 0,
    fontWeight: 'bold',
    flex: 1,
  },
  chartIcon: {
    width: 20,
    height: 18,
    margin: 10,
  },
});

const ValueContent = React.memo(({ item, request }) => {
  if (request?.status === 'pending') {
    return <ActivityIndicator size="small" color={theme.variables.spinnerColor} />;
  }

  return (
    <>
      <RequestError request={request} />
      <States value={item} />
    </>
  );
});

const ValueComponent = React.memo(({ item }) => {
  const { request, send } = useRequest();
  const navigation = useNavigation();

  const navigateToLog = useCallback(() => {
    navigation.navigate('LogScreen', {
      id: item.meta.id,
    });
  }, [item.meta.id, navigation]);

  const updateValueStatus = useCallback(() => {
    send({
      method: 'PATCH',
      url: '/value/' + item.meta.id,
      body: {
        status: 'update',
      },
    });
  }, [item.meta.id, send]);

  if (!item.meta || item.meta.error) {
    return null;
  }

  return (
    <View style={styles.itemPanel}>
      <View style={styles.itemHeader}>
        <Text size={16} content={item.name} style={styles.itemHeaderText} />
        <>
          {item.number && (
            <TouchableOpacity onPress={navigateToLog}>
              <Image
                resizeMode="contain"
                source={require('../../../../assets/images/line-chart.png')}
                style={styles.chartIcon}
              />
            </TouchableOpacity>
          )}
          <Button
            type="link"
            onPress={updateValueStatus}
            icon="rotate-cw"
            disabled={request?.status === 'pending'}
          />
          <ValueDetails item={item} />
        </>
      </View>
      <ValueContent item={item} request={request} />
    </View>
  );
});

ValueComponent.displayName = 'ValueComponent';
export default ValueComponent;
