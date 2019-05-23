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
              onEndReachedThreshold={2}
              ListFooterComponent={request && request.status === 'pending' && request.options.query.offset ? <ActivityIndicator size='large'/>: null}
            /> :
            <Fragment>
              <TouchableOpacity style={[theme.common.button, theme.common.roundOutline, theme.common.row, {backgroundColor: 'white', justifyContent: 'center'}]} onPress={this.refresh}>
                <Icon name='rotate-cw' size={20} color={theme.variables.primary} style={{marginRight: 20}}/>
                <Text>Refresh</Text>
              </TouchableOpacity>
              <Text>List is empty</Text>
            </Fragment>
        }
        <RequestError error={request}/>
      </View>
    );
  }
}

export default connect(ListComponent);
