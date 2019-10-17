import {connect as reduxConnect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';

import * as request from '../wappsto-redux/actions/request';
import * as items from '../wappsto-redux/actions/items';

import {getUserData} from '../wappsto-redux/selectors/entities';
import {getRequest} from '../wappsto-redux/selectors/request';
import {getItem} from '../wappsto-redux/selectors/items';

function mapStateToProps(state) {
  return {
    request: getRequest(state, '/user', 'GET'),
    user: getUserData(state),
    fetched: getItem(state, 'user_fetched'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({...request, ...items}, dispatch),
  };
}

export class Account extends Component {
  componentDidMount() {
    if (!this.props.fetched) {
      this.props.setItem('user_fetched', true);
      this.props.makeRequest('GET', '/user', null, {query: {expand: 0}});
    } else if (this.props.request && this.props.request.status === 'error') {
      this.props.makeRequest('GET', '/user', null, {query: {expand: 0}});
    }
  }
}

export function connect(component) {
  return reduxConnect(mapStateToProps, mapDispatchToProps)(component);
}

export default connect(Account);
