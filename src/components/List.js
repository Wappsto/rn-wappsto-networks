import React, { useMemo, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import Text from '../components/Text';
import Button from '../components/Button';
import { useTranslation, CapitalizeFirst } from '../translations';
import usePageList from '../hooks/usePageList';
import { iotNetworkAddFlow } from '../util/params';
import { useSelector } from 'react-redux';
import { makeItemSelector } from 'wappsto-redux';

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    marginTop: 30,
    justifyContent: 'center',
  },
});

const ListEmptyComponent = React.memo(({ request, refresh }) => {
  const { t } = useTranslation();
  const getItem = useMemo(makeItemSelector, []);
  const showAddFlow = useSelector(state => getItem(state, iotNetworkAddFlow));

  if (!request || request.status !== 'pending') {
    return null;
  }
  if (request.status === 'success') {
    return (
      <>
        <Text
          size="p"
          align="center"
          color="secondary"
          content={CapitalizeFirst(t('noData'))}
          style={theme.common.spaceAround}
        />
        {request.url === '/network' && (
          <Button
            onPress={showAddFlow}
            type="link"
            color="primary"
            text={CapitalizeFirst(t('onboarding.claimNetwork.claimNetworkTitle'))}
          />
        )}
      </>
    );
  }
  if (request.status === 'error') {
    return (
      <>
        <View style={styles.centered}>
          <RequestError request={request} autoHide={false} />
        </View>
        <Button
          onPress={refresh}
          type="link"
          color="primary"
          text={CapitalizeFirst(t('genericButton.refresh'))}
        />
      </>
    );
  }
});
const ListFooterComponent = React.memo(({ request }) => {
  if (request && request.status === 'pending' && request.options.query.offset) {
    <ActivityIndicator color={theme.variables.spinnerColor} size="large" />;
  }
  return null;
});
const List = React.memo(
  ({
    name,
    url,
    query,
    style,
    listHeaderComponent,
    renderItem,
    addItemName,
    removeItemName,
    minimumItems = 10,
  }) => {
    const { items, request, refresh, canLoadMore, loadMore } = usePageList(
      name,
      url,
      query,
      addItemName,
      removeItemName,
    );

    useEffect(() => {
      if (items.length < minimumItems && request.status === 'success' && canLoadMore) {
        loadMore();
      }
    }, [canLoadMore, items, loadMore, minimumItems, request.status, request.statuscanLoadMore]);

    return (
      <View style={style || theme.common.container}>
        {items && items.length > 0 && (
          <FlatList
            keyExtractor={item => item.meta.id}
            data={items}
            ListHeaderComponent={listHeaderComponent}
            ListEmptyComponent={<ListEmptyComponent request={request} refresh={refresh} />}
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
            ListFooterComponent={<ListFooterComponent request={request} />}
          />
        )}
      </View>
    );
  },
);

List.displayName = 'List';
export default List;
