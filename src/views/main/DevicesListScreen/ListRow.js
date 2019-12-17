import React, { useCallback } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import { useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux/actions/items';
import i18n from '../../../translations';
import DeviceSettings from './DeviceSettings';
import theme from '../../../theme/themeExport';

const ListRow = React.memo(({ item, childName, selectedName, navigateTo, navigation }) => {
  const dispatch = useDispatch();

  const navigate = useCallback(() => {
    dispatch(setItem(selectedName, item.meta.id));
    navigation.navigate(navigateTo, {
      title: item.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, selectedName]);

  return (
    <TouchableOpacity onPress={navigate}>
      <View style={[theme.common.listItem]}>
        <View style={theme.common.listItemTitleArea}>
          <Text style={theme.common.listItemHeader}>{item.name}</Text>
          <Text style={theme.common.listItemSubheader}>
            {item[childName].length}{' '}
            {i18n.t(childName, {count: item[childName].length})}
          </Text>
        </View>
        <DeviceSettings item={item} />
      </View>
    </TouchableOpacity>
  );
});

export default ListRow;
