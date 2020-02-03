import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, SectionList, TouchableOpacity, ActivityIndicator, AppState } from 'react-native';
import RequestError from './RequestError';
import theme from '../theme/themeExport';
import i18n, { CapitalizeFirst } from '../translations';
import useList from 'wappsto-blanket/hooks/useList';
import { setItem } from 'wappsto-redux/actions/items';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { config } from '../configureWappstoRedux';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { currentPage } from '../util/params';

const List = React.memo(({ name, url, query, style, renderSectionHeader, renderSectionFooter, renderItem, addItemName, onRefresh, page }) => {
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => getStream(state, config.stream && config.stream.name));
  const [ appState, setAppState ] = useState(AppState.currentState);
  const { items, request, refresh, loadMore, canLoadMore, addItem } = useList({ name, url, query, resetOnEmpty: true });
  const getItem = useMemo(makeItemSelector, []);
  const currPage = useSelector(state => getItem(state, currentPage));

  useEffect(() => {
    if(addItemName){
      dispatch(setItem(addItemName, () => addItem));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItemName, addItem]);

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

  const _handleAppStateChange = (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active' && stream && stream.ws && stream.ws.readyState === stream.ws.CLOSED) {
      refresh(currPage === page);
    }
    setAppState(nextAppState);
  };

  // handle app status change
  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, stream, currPage]);

  return (
    <View style={style || theme.common.container}>
      <SectionList
        keyExtractor={(item, index) => item.meta.id}
        sections={data}
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
        onRefresh={refreshList}
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
