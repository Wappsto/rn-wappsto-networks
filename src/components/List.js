import React from 'react';
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import i18n, { CapitalizeFirst } from '../translations';
import usePageList from '../hooks/usePageList';
import useSectionData from '../hooks/useSectionData';

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
  const { items, request, refresh, canLoadMore, loadMore } = usePageList(name, url, query, addItemName, removeItemName, page);
  const data = useSectionData(items, url);

  return (
    <View style={style || theme.common.container}>
      <SectionList
        keyExtractor={(item, index) => item.meta.id}
        sections={data}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={
          (!request || request.status !== 'pending') && (
            <>
              <Text style={theme.common.infoText}>
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
        renderSectionFooter={renderSectionFooter}
        renderItem={renderItem}
        refreshing={
          (request &&
            request.status === 'pending' &&
            (!request.options.query || !request.options.query.offset)) ||
          false
        }
        onRefresh={refresh}
        onEndReached={canLoadMore && loadMore}
        onEndReachedThreshold={0.1}
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
