import React, { useMemo, useCallback } from 'react';
import { View, TouchableOpacity,StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { selectedDeviceName } from '../../../util/params';
import { useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux/actions/items';
import theme from '../../../theme/themeExport';
import Text from '../../../components/Text';
import { useTranslation } from '../../../translations';

const styles = StyleSheet.create({
  listItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 1,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: theme.variables.borderRadiusBase,
    backgroundColor: theme.variables.white,
  },
  listItemTitleArea: {
    flex: 1,
  },
  listItemHeader: {
    fontSize: 16,
    color: theme.variables.primary
  },
  listItemSubheader: {
    fontSize: theme.variables.defaultFontSize - 1,
    color: theme.variables.textSecondary
  },
});

const DeviceItem = React.memo(({ navigation, id, isPrototype }) => {
  const { t } = useTranslation();
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
      <View style={[styles.listItem, isPrototype ? { backgroundColor: '#e5e5e5' } : {}]}>
        <View style={styles.listItemTitleArea}>
          <Text
            style={styles.listItemHeader}
            content={device.name}
          />
          <Text
            style={styles.listItemSubheader}
            content={device.value.length + ' ' + t('value', {count: device.value.length})}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DeviceItem;
