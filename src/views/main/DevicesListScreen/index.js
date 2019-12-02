import React, {Component} from 'react';
import {AppState, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Screen from '../../../components/Screen';
import MenuButton from '../../../components/MenuButton';
import List from '../../../components/List';
import DeviceSection from './DeviceSection';
import AddNetworkButton from './AddNetworkButton';
import {startStream, getStreams} from '../../../utils';
import {getSession} from '../../../wappsto-redux/selectors/session';
import {initializeStream, closeStream} from '../../../wappsto-redux/actions/stream';

import theme from '../../../theme/themeExport';
import i18n, {
  CapitalizeEach,
  CapitalizeFirst,
} from '../../../translations/i18n';

const query = {
  expand: 1,
  limit: 10,
};

function mapStateToProps(state, componentProps) {
  return {
    currentStreams: getStreams(state),
    session: getSession(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {initializeStream, closeStream},
      dispatch,
    ),
  };
}

class DevicesListScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
    startStream(props.currentStreams, props.session, props.initializeStream, props.closeStream);
  }
  static navigationOptions = ({navigation}) => {
    return {
      ...theme.headerStyle,
      title: CapitalizeEach(i18n.t('pageTitle.main')),
      headerLeft: <MenuButton navigation={navigation} />,
      headerRight: <AddNetworkButton navigation={navigation} />,
    };
  };
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      startStream(this.props.currentStreams, this.props.session, this.props.initializeStream, this.props.closeStream);
    }
    this.setState({appState: nextAppState});
  };
  render() {
    return (
      <Screen>
        <List
          refreshItem="refreshList"
          type="network"
          query={query}
          renderSectionHeader={({section: {title}}) => {
            if(title.name){
                return (<Text style={theme.common.listHeader}><Text style={{ fontWeight: "600" }}>{title.name}</Text> - {title.id}</Text>);
            }
            return (<Text style={theme.common.listHeader}>{title.id}</Text>);
          }}
          renderItem={({item}) => {
            if (item.device.length === 0) {
              return (
                <Text style={[theme.common.infoText, theme.common.secondary]}>
                  {CapitalizeFirst(i18n.t('infoMessage.networkIsEmpty'))}
                </Text>
              );
            }
            return item.device.map(id => (
              <DeviceSection
                key={id}
                id={id}
                navigation={this.props.navigation}
              />
            ));
          }}
        />
      </Screen>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesListScreen);
