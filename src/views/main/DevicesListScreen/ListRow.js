import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import * as items from 'wappsto-redux/actions/items';

import i18n from '../../../translations/i18n';
import DeviceSettings from './DeviceSettings';
import theme from '../../../theme/themeExport';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(items, dispatch),
  };
}

class ListRow extends Component {
  static propTypes = {
    selectedName: PropTypes.string.isRequired,
    navigateTo: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
  };

  navigate = () => {
    this.props.setItem(this.props.selectedName, this.props.item.meta.id);
    this.props.navigation.navigate(this.props.navigateTo, {
      title: this.props.item.name,
    });
  };

  render() {
    const {item, childName} = this.props;
    return (
      <TouchableOpacity onPress={this.navigate}>
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
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ListRow);
