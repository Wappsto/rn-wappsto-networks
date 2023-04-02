import React, { useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { makeEntitySelector, setItem } from 'wappsto-redux';
import Text from '../../../components/Text';
import theme from '../../../theme/themeExport';
import { useTranslation } from '../../../translations';
import { selectedDeviceName } from '../../../util/params';
import { useNavigation } from '@react-navigation/native';

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
    color: theme.variables.primary,
  },
  listItemSubheader: {
    fontSize: theme.variables.defaultFontSize - 1,
    color: theme.variables.textSecondary,
  },
});

const DeviceItem = React.memo(({ id }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device', id));

  const dispatch = useDispatch();

  const navigate = useCallback(() => {
    dispatch(setItem(selectedDeviceName, device.meta.id));
    navigation.navigate('DeviceScreen');
  }, [device.meta.id, dispatch, navigation]);

  if (!device || !device.meta || !device.meta.id || device.meta.error) {
    return null;
  }
  return (
    <TouchableOpacity onPress={navigate}>
      <View style={styles.listItem}>
        <View style={styles.listItemTitleArea}>
          <Text style={styles.listItemHeader} content={device.name} />
          <Text
            style={styles.listItemSubheader}
            content={
              device.value.length + ' ' + t('dataModel:value', { count: device.value.length })
            }
          />
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DeviceItem;
