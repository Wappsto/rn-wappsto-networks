import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../translations';
import usePageList from '../hooks/usePageList';

const List = React.memo(({
  name,
  url,
  query,
  style,
  listHeaderComponent,
  renderSectionHeader,
  renderSectionFooter,
  renderItem,
  addItemName,
  removeItemName,
  page
}) => {
  const { t } = useTranslation();
  const { items, request, refresh, canLoadMore, loadMore } = usePageList(name, url, query, addItemName, removeItemName, page);

  return (
    <View style={style || theme.common.container}>
      <FlatList
        keyExtractor={(item, index) => item.meta.id}
        data={items}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          (!request || request.status !== 'pending') && (
            <>
              <Text style={theme.common.infoText}>
                {CapitalizeFirst(t('infoMessage.listIsEmpty'))}
              </Text>
              <TouchableOpacity
                onPress={refresh}
                style={[theme.common.button, theme.common.ghost]}>
                <Text>{CapitalizeFirst(t('refresh'))}</Text>
              </TouchableOpacity>
            </>
          )
        }
        renderItem={renderItem}
        refreshing={
          (request &&
            request.status === 'pending' &&
            (!request.options.query || !request.options.query.offset)) ||
          false
        }
        onRefresh={refresh}
        onEndReached={canLoadMore && loadMore}
        onEndReachedThreshold={0.3}
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
