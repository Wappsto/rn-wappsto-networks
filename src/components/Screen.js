import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {config} from '../configureWappstoRedux';

import {getStream} from 'wappsto-redux/selectors/stream';

import {openStream, status, steps} from 'wappsto-redux/actions/stream';

import NetInfo from '@react-native-community/netinfo';

import theme from '../theme/themeExport';

function mapStateToProps(state, componentProps) {
  if (!config.stream || !config.stream.name) {
    return {};
  }
  return {
    stream: getStream(state, config.stream.name),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({openStream}, dispatch),
  };
}

class Screen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: true,
    };
    this.checkConnection = this.checkConnection.bind(this);
    this.reconnectStream = this.reconnectStream.bind(this);
  }

  componentDidMount() {
    NetInfo.isConnected.fetch(this.checkConnection);
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.checkConnection,
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.checkConnection,
    );
  }

  checkConnection(isConnected) {
    this.setState({
      connected: isConnected,
    });
  }

  reconnectStream() {
    this.props.openStream(this.props.stream.json);
  }

  getStreamMessage(stream = {}) {
    let mStatus = '',
      mStep;
    switch (stream.status) {
      case status.CONNECTING:
      case status.RECONNECTING:
        mStatus =
          stream.status === status.CONNECTING
            ? 'connecting...'
            : 'reconnecting...';
        switch (stream.step) {
          case steps.CONNECTING.GET_STREAM:
            mStep = 'getting stream list...';
            break;
          case steps.CONNECTING.CREATE_STREAM:
            mStep = 'creating stream...';
            break;
          case steps.CONNECTING.UPDATE_STREAM:
            mStep = 'updating stream...';
            break;
          case steps.CONNECTING.OPENING_SOCKET:
          case steps.CONNECTING.WAITING:
            mStep = 'opening connection...';
            break;
        }
        break;
      case status.OPEN:
        mStatus = 'open';
        break;
      case status.CLOSED:
        mStatus = 'stream connection closed';
        switch (stream.code) {
          case 4000:
            mStep = 'internal error';
            break;
          case 4001:
            mStep = 'session not valid';
            break;
          case 4002:
            mStep = 'forbidden';
            break;
          case 4003:
            mStep = 'no subscriptions';
            break;
          case 4004:
            mStep = 'stopped';
            break;
          case 4005:
            mStep = 'impossible to open websocket';
            break;
        }
        break;
      case status.ERROR:
        mStatus = 'error';
        break;
      case status.LOST:
        mStatus = 'connection lost';
        break;
    }
    let result = mStatus + (mStep ? '\n' + mStep : '');
    if (result) {
      return result;
    }
    return undefined;
  }

  render() {
    let stream = this.props.stream;
    let showStream = this.state.connected && stream && stream.status !== 2;
    return (
      <SafeAreaView style={theme.common.safeAreaView}>
        {!this.state.connected && (
          <Text style={theme.common.warning}> Internet connection is lost</Text>
        )}
        {showStream && (
          <View style={theme.common.warning}>
            <Text>{this.getStreamMessage(stream)}</Text>
            {stream.status === status.LOST && (
              <TouchableOpacity onPress={this.reconnectStream}>
                <Text style={{textDecorationLine: 'underline'}}>try again</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={this.props.style || {flex: 1}}>{this.props.children}</View>
      </SafeAreaView>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Screen);
