import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component, Fragment} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

import ControlState from './ControlState';
import ReportState from './ReportState';
import RequestError from '../../../components/RequestError';

import {setItem} from '../../../wappsto-redux/actions/items';
import {makeRequest, removeRequest} from '../../../wappsto-redux/actions/request';

import {getRequestAndError} from '../../../wappsto-redux/selectors/request';
import {getEntities} from '../../../wappsto-redux/selectors/entities';
import {getItem} from '../../../wappsto-redux/selectors/items';

import theme from '../../../theme/themeExport';
import i18n, {CapitalizeFirst} from '../../../translations/i18n';

function mapStateToProps(state, componentProps) {
  let id = componentProps.value.meta.id;
  let url = '/value/' + id + '/state';
  return {
    url: url,
    request: getRequestAndError(state, url, 'GET'),
    states: getEntities(state, 'state', {parent: {type: 'value', id: id}}),
    fetched: getItem(state, url + '_fetched'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({makeRequest, removeRequest, setItem}, dispatch),
  };
}

class StatesComponent extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentWillUnmount() {
    this.props.removeRequest(this.props.url, 'GET');
  }

  componentDidMount() {
    if (!this.props.fetched) {
      this.props.setItem(this.props.url + '_fetched', true);
      if (this.props.states.length !== this.props.value.state.length) {
        this.refresh();
      }
    } else if (this.props.request.error) {
      this.refresh();
    }
  }

  refresh() {
    let {request} = this.props.request;
    if (!request || request.status !== 'pending') {
      this.props.makeRequest('GET', this.props.url, null, {query: {expand: 0}});
    }
  }

  render() {
    const {request, error} = this.props.request;
    const value = this.props.value;
    const states = this.props.states;
    const reportState = states.find(s => s.type === 'Report');
    const controlState = states.find(s => s.type === 'Control');
    return (
      <View>
        {states.length !== 0 && (
          <Fragment>
            <View style={theme.common.itemContent}>
              {reportState ? (
                <View>
                  <ReportState value={value} state={reportState} />
                  <Text style={theme.common.timestamp}>
                    {CapitalizeFirst(i18n.t('lastUpdated'))}:{' '}
                    {new Date(reportState.timestamp).toLocaleString()}
                  </Text>
                </View>
              ) : null}
              {reportState && controlState ? (
                <View style={theme.common.seperator} />
              ) : null}
              {controlState ? (
                <View>
                  <ControlState value={value} state={controlState} />
                  <Text style={theme.common.timestamp}>
                    {CapitalizeFirst(i18n.t('lastUpdated'))}:{' '}
                    {new Date(controlState.timestamp).toLocaleString()}
                  </Text>
                </View>
              ) : null}
            </View>
          </Fragment>
        )}
        {request && request.status === 'pending' && (
          <ActivityIndicator size="large" />
        )}
        <RequestError error={error} />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StatesComponent);
