import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';

import {config} from '../configureWappstoRedux';

import {getStream} from 'wappsto-redux/selectors/stream';

import {openStream, status, steps} from 'wappsto-redux/actions/stream';

import NetInfo from '@react-native-community/netinfo';

import i18n, {CapitalizeFirst} from '../translations/i18n';
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
            ? CapitalizeFirst(i18n.t('statusMessage.connecting'))
            : CapitalizeFirst(i18n.t('statusMessage.reconnecting'));
        switch (stream.step) {
          case steps.CONNECTING.GET_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.gettingStream'));
            break;
          case steps.CONNECTING.CREATE_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.creatingStream'));
            break;
          case steps.CONNECTING.UPDATE_STREAM:
            mStep = CapitalizeFirst(i18n.t('statusMessage.updatingStream'));
            break;
          case steps.CONNECTING.OPENING_SOCKET:
          case steps.CONNECTING.WAITING:
            mStep = CapitalizeFirst(i18n.t('statusMessage.openingConnection'));
            break;
        }
        break;
      case status.OPEN:
        mStatus = CapitalizeFirst(i18n.t('statusMessage.streamOpen'));
        break;
      case status.CLOSED:
        mStatus = CapitalizeFirst(i18n.t('statusMessage.streamClosed'));
        mStep = CapitalizeFirst(i18n.t('error:stream.code.' + stream.code));
        break;
      case status.ERROR:
        mStatus = CapitalizeFirst(i18n.t('error:generic'));
        break;
      case status.LOST:
        mStatus = CapitalizeFirst(i18n.t('error:stream.connectionLost'));
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
          <Text style={[theme.common.toastFullWidth, theme.common.warning]}>{CapitalizeFirst(i18n.t('error:internetConnectionLost'))}</Text>
        )}
        {showStream && (
          <View style={[theme.common.toastFullWidth, theme.common.warning]}>
            <Text>{this.getStreamMessage(stream)}</Text>
            {stream.status === status.LOST && (
              <TouchableOpacity onPress={this.reconnectStream}>
                <Text style={theme.common.actionText}>{CapitalizeFirst(i18n.t('tryAgain'))}</Text>
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
