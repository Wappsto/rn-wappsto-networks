import React from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import Text from '../components/Text';
import Button from '../components/Button';
import { useTranslation, CapitalizeFirst } from '../translations';
import usePageList from '../hooks/usePageList';

const styles = StyleSheet.create({
  centered:{
    alignItems:'center',
    marginTop: 30,
    justifyContent: 'center'
  }
});

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
              { request.status !== 'error' &&
                <Text
                  size='p'
                  align='center'
                  color='secondary'
                  content={CapitalizeFirst(t('noData'))}
                  style={theme.common.spaceAround}
                />
              }
              <View style={styles.centered}>
                <RequestError request={request} autoHide={false} />
              </View>
              <Button
                onPress={refresh}
                type='link'
                color='primary'
                text={CapitalizeFirst(t('genericButton.refresh'))}
              />
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
            <ActivityIndicator color={theme.variables.spinnerColor} size='large' />
          ) : null
        }
      />
    </View>
  );
});

export default List;
