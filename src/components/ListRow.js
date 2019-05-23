import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import * as items from 'wappsto-redux/actions/items';

import theme from "../theme/themeExport";
import Icon from 'react-native-vector-icons/Feather';

function mapStateToProps(state){
  return {};
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators(items, dispatch)
  }
}

class ListRow extends Component {
  static propTypes = {
    selectedName: PropTypes.string.isRequired,
    navigateTo: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  }

  navigate(){
    this.props.setItem(this.props.selectedName, this.props.item.meta.id);
    this.props.navigation.navigate(this.props.navigateTo, { title: this.props.item.name });
  }
  render() {
    let item = this.props.item;
    return (
      <View style={theme.common.listItem}>
        <View style={theme.common.listItemTitleArea}>
          <Text style={theme.common.listItemHeader}>{item.name}</Text>
          <Text style={theme.common.listItemSubheader}>{item.meta.id}</Text>
        </View>
        <TouchableOpacity onPress={this.navigate.bind(this)}>
          <Icon name="arrow-right" size={25} style={theme.common.listItemArrow} color={theme.variables.primary} />
        </TouchableOpacity>
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListRow);
