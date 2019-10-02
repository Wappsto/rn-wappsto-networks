import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import RequestError from './RequestError';

import theme from '../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';
import i18n, {CapitalizeFirst} from '../translations/i18n';
import { List, connect }from 'wappsto-components/List';

class ListComponent extends List {
  render() {
    let list = this.props.items;
    let request = this.props.request;
    return (
      <View style={this.props.style || theme.common.container}>
        {
          (request && request.status === 'pending' ) || list.length !== 0 ?
            <FlatList
              keyExtractor={(item, index) => item.meta.id}
              data={list}
              renderItem={this.props.renderItem}
              refreshing={request && request.status === 'pending' && (!request.options.query || !request.options.query.offset)}
              onRefresh={this.refresh}
              onEndReached={this.loadMore}
              onEndReachedThreshold={0.01}
              ListFooterComponent={request && request.status === 'pending' && request.options.query.offset ? <ActivityIndicator size='large'/>: null}
            /> :
            <Fragment>
              <Text styles={theme.common.infoText}>{CapitalizeFirst(i18n.t('infoMessage.listIsEmpty'))}</Text>
              <TouchableOpacity onPress={this.refresh} style={[theme.common.button, theme.common.ghost]}>
                <Text >{CapitalizeFirst(i18n.t('refresh'))}</Text>
              </TouchableOpacity>
            </Fragment>
        }
        <RequestError error={request}/>
      </View>
    );
  }
}

export default connect(ListComponent);
