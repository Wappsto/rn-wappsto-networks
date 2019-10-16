import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component, Fragment} from 'react';
import {View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import States from './States';
import ValueSettings from './ValueSettings';

import {makeRequest} from 'wappsto-redux/actions/request';
import {getRequest} from 'wappsto-redux/selectors/request';

import theme from '../../../theme/themeExport';
import Icon from 'react-native-vector-icons/Feather';

function mapStateToProps(state, componentProps) {
  let valueId = componentProps.item.meta.id;
  return {
    request: getRequest(state, '/value/' + valueId, 'PATCH'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({makeRequest}, dispatch),
  };
}

class ValueComponent extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('title', ''),
    };
  };

  updateValueStatus = () => {
    this.props.makeRequest('PATCH', '/value/' + this.props.item.meta.id, {
      status: 'update',
    });
  };

  render() {
    const request = this.props.request;
    const value = this.props.item;
    return (
      <View style={theme.common.itemPanel}>
        <View style={theme.common.itemHeader}>
          <Text style={[theme.common.listItemTitleArea]}>{value.name}</Text>
          <Fragment>
            {request && request.status === 'pending' ? (
              <ActivityIndicator
                size="small"
                color={theme.variables.primary}
                style={theme.common.iconButton}
              />
            ) : (
              <TouchableOpacity
                style={theme.common.iconButton}
                onPress={this.updateValueStatus}>
                <Icon
                  name="rotate-cw"
                  size={20}
                  color={theme.variables.primary}
                />
              </TouchableOpacity>
            )}
            <ValueSettings item={value} />
          </Fragment>
        </View>
        <States value={value} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ValueComponent);