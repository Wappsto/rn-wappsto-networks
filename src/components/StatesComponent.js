import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import React, { Component, Fragment } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl
} from 'react-native';

import ControlState from './ControlState';
import ReportState from './ReportState';
import RequestError from "./RequestError";

import * as items from 'wappsto-redux/actions/items';
import * as request from 'wappsto-redux/actions/request';

import { getRequestAndError } from 'wappsto-redux/selectors/request';
import { getEntity, getEntities } from 'wappsto-redux/selectors/entities';
import { getItem } from 'wappsto-redux/selectors/items';

import theme from "../theme/themeExport";
import Icon from 'react-native-vector-icons/Feather';

function mapStateToProps(state, componentProps){
  let id = componentProps.value.meta.id;
  let url = "/value/" + id + "/state";
  return {
    url: url,
    request: getRequestAndError(state, url, "GET"),
    states: getEntities(state, "state", { parent: { type: "value", id: id} }),
    fetched: getItem(state, url + "_fetched")
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators({...request, ...items}, dispatch)
  }
}

class StatesComponent extends Component {
  static propTypes = {
    value: PropTypes.object.isRequired
  }

  constructor(props){
    super(props);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount(){
    if(!this.props.fetched){
      this.props.setItem(this.props.url + "_fetched", true);
      if(this.props.states.length !== this.props.value.state.length){
        this.refresh();
      }
    } else if(this.props.request.error){
      this.refresh();
    }
  }

  refresh(){
    let { request } = this.props.request;
    if(!request || request.status !== "pending"){
      this.props.makeRequest("GET", this.props.url, null, { query: { expand: 0 }});
    }
  }

  render() {
    let { request, error } = this.props.request;
    let value = this.props.value;
    let states = this.props.states;
    let reportState = states.find(s => s.type === "Report");
    let controlState = states.find(s => s.type === "Control");
    return (
      <View>
        {
          states.length !== 0 &&
          <Fragment>
            <View style={theme.common.itemContent}>
              { controlState ? <ControlState value={value} state={controlState} /> : null}
              { reportState && !controlState ? <ReportState value={value} state={reportState} /> : null}
            </View>
            <View style={[theme.common.itemFooter]}>
              { controlState && reportState && <Text style={[theme.common.barItem, theme.common.barItemSeparator]}>{reportState.data}</Text>}
              {
                reportState ?
                <Text  style={theme.common.barItem}>Last updated: {(new Date(reportState.timestamp)).toLocaleString()}</Text> :
                controlState && <Text  style={theme.common.barItem}>Last updated: {(new Date(controlState.timestamp)).toLocaleString()}</Text>
              }
            </View>
          </Fragment>
        }
        {
          request && request.status === "pending" &&
          <ActivityIndicator size='large'/>
        }
        <RequestError error={error} />
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatesComponent);
