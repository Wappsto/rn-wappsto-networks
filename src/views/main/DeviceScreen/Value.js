import React, { useCallback } from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import States from './States';
import ValueDetails from './ValueDetails';
import theme from '../../../theme/themeExport';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import RequestError from '../../../components/RequestError';
import Text from '../../../components/Text';
import Button from '../../../components/Button';


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
    marginBottom:0,
    fontWeight: 'bold',
    flex:1
  }
});

const ValueComponent = React.memo(({ item, navigation }) => {
  const { request, send } = useRequest();

  const updateValueStatus = useCallback(() => {
    send({
      method: 'PATCH',
      url: '/value/' + item.meta.id,
      body: {
        status: 'update'
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <View style={styles.itemPanel}>
      <View style={styles.itemHeader}>
        <Text
          size={16}
          content={item.name}
          style={styles.itemHeaderText}
        />
        <>
          {request && request.status === 'pending' ? (
            <ActivityIndicator
              size='small'
              color={theme.variables.spinnerColor}
            />
          ) : (
            <Button
              type='link'
              onPress={updateValueStatus}
              icon='rotate-cw'
            />
          )}
          <ValueDetails item={item} />
        </>
      </View>
      <RequestError request={request} />
      <States value={item} />
    </View>
  );
});

ValueComponent.navigationOptions = ({navigation}) => {
  return {
    title: navigation.getParam('title', ''),
  };
};

export default ValueComponent;
