import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { selectedDeviceName } from '../../../util/params';
import { useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux/actions/items';
import theme from '../../../theme/themeExport';
import i18n from '../../../translations';

const DeviceSection = React.memo(({ navigation, id, isPrototype }) => {
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device', id));

  const dispatch = useDispatch();

  const navigate = useCallback(() => {
    dispatch(setItem(selectedDeviceName, device.meta.id));
    navigation.navigate('DeviceScreen', {
      title: device.name
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [device]);

  if(!device || !device.meta || !device.meta.id){
    return null;
  }
  return (
    <TouchableOpacity onPress={navigate}>
      <View style={[theme.common.listItem, isPrototype ? { backgroundColor: '#e5e5e5' } : {}]}>
        <View style={theme.common.listItemTitleArea}>
          <Text style={theme.common.listItemHeader}>{device.name}</Text>
          <Text style={theme.common.listItemSubheader}>
            {device.value.length}{' '}
            {i18n.t('value', {count: device.value.length})}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DeviceSection;
