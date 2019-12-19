import React, { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import i18n, { CapitalizeFirst } from '../translations';
import useList from 'wappsto-blanket/hooks/useList';
import { setItem } from 'wappsto-redux/actions/items';

const List = React.memo(({ name, url, query, style, renderSectionHeader, renderItem, addItemName, onRefresh }) => {
  const dispatch = useDispatch();
  const { items, request, refresh, loadMore, canLoadMore, addItem } = useList({ name, url, query, resetOnEmpty: true });

  useEffect(() => {
    if(addItemName){
      dispatch(setItem(addItemName, () => addItem));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemName]);

  const data = [];
  items.forEach(item => {
    data.push({
      title: item,
      data: [item]
    });
  });

  const refreshList = useCallback(() => {
    if(onRefresh){
      onRefresh(items);
    }
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, onRefresh]);

  return (
    <View style={style || theme.common.container}>
      <SectionList
        keyExtractor={(item, index) => item.meta.id}
        sections={data}
        ListEmptyComponent={
          (!request || request.status !== 'pending') && (
            <>
              <Text styles={theme.common.infoText}>
                {CapitalizeFirst(i18n.t('infoMessage.listIsEmpty'))}
              </Text>
              <TouchableOpacity
                onPress={refresh}
                style={[theme.common.button, theme.common.ghost]}>
                <Text>{CapitalizeFirst(i18n.t('refresh'))}</Text>
              </TouchableOpacity>
            </>
          )
        }
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        refreshing={
          (request &&
            request.status === 'pending' &&
            (!request.options.query || !request.options.query.offset)) ||
          false
        }
        onRefresh={refreshList}
        onEndReached={canLoadMore && loadMore}
        onEndReachedThreshold={0.01}
        ListFooterComponent={
          request &&
          request.status === 'pending' &&
          request.options.query.offset ? (
            <ActivityIndicator size='large' />
          ) : null
        }
      />
      <RequestError request={request} />
    </View>
  );
});

export default List;
