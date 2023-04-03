import React, { useCallback } from 'react';
import { ActivityIndicator, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRequest } from 'wappsto-blanket';
import Button from '../../../components/Button';
import RequestError from '../../../components/RequestError';
import Text from '../../../components/Text';
import theme from '../../../theme/themeExport';
import { useTranslation } from '../../../translations';
import States from './States';
import ValueDetails from './ValueDetails';

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

const ValueComponent = React.memo(({ item, navigation }) => {
  const { t } = useTranslation();
  const { request, send } = useRequest();

  const navigateToLog = useCallback(() => {
    navigation.navigate('LogScreen', {
      title: `${item.meta.name_by_user || item.name} ${t('pageTitle.logs')}`,
      id: item.meta.id,
    });
  }, [navigation, t, item]);

  const updateValueStatus = useCallback(() => {
    send({
      method: 'PATCH',
      url: '/value/' + item.meta.id,
      body: {
        status: 'update',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

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
          {request && request.status === 'pending' ? (
            <ActivityIndicator size="small" color={theme.variables.spinnerColor} />
          ) : (
            <Button type="link" onPress={updateValueStatus} icon="rotate-cw" />
          )}
          <ValueDetails item={item} />
        </>
      </View>
      <RequestError request={request} />
      <States value={item} />
    </View>
  );
});

ValueComponent.navigationOptions = ({ route }) => {
  return {
    title: route.params.title || '',
  };
};

export default ValueComponent;
