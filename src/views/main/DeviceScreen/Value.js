import React, { useCallback } from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import States from './States';
import ValueSettings from './ValueSettings';
import theme from '@/theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';
import useRequest from 'wappsto-blanket/hooks/useRequest';

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
    <View style={theme.common.itemPanel}>
      <View style={theme.common.itemHeader}>
        <Text style={[theme.common.listItemTitleArea]}>{item.name}</Text>
        <>
          {request && request.status === 'pending' ? (
            <ActivityIndicator
              size='small'
              color={theme.variables.primary}
              style={theme.common.iconButton}
            />
          ) : (
            <TouchableOpacity
              style={theme.common.iconButton}
              onPress={updateValueStatus}>
              <Icon
                name='rotate-cw'
                size={20}
                color={theme.variables.primary}
              />
            </TouchableOpacity>
          )}
          <ValueSettings item={item} />
        </>
      </View>
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
