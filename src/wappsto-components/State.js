import {connect as reduxConnect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';

import * as request from '../wappsto-redux/actions/request';

import {getRequest} from '../wappsto-redux/selectors/request';

function mapStateToProps(state, componentProps) {
  return {
    request: getRequest(
      state,
      '/state/' + componentProps.state.meta.id,
      'PATCH',
    ),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(request, dispatch),
  };
}

export class State extends Component {
  constructor(props) {
    super(props);
    this.updateState = this.updateState.bind(this);
    this.isUpdating = this.isUpdating.bind(this);
    this.state = {
      input:
        (this.props.request &&
          this.props.request.status === 'pending' &&
          this.props.request.body.data) ||
        this.props.state.data,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.state.type === 'Report') {
      return {
        input: props.state.data,
      };
    }
    return null;
  }

  updateState(data) {
    data = data + '';
    if (data === this.props.state.data) {
      return;
    }
    if (!this.isUpdating()) {
      let timestamp = new Date().toISOString();
      this.props.makeRequest('PATCH', '/state/' + this.props.state.meta.id, {
        data,
        timestamp,
      });
    }
  }

  isUpdating() {
    return this.props.request && this.props.request.status === 'pending'
      ? true
      : false;
  }
}

export function connect(component) {
  return reduxConnect(mapStateToProps, mapDispatchToProps)(component);
}

export default connect(State);
