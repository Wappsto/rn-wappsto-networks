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

import StateComponent from './StateComponent';
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
      this.refresh();
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
      <View style={theme.common.container}>
        {
          states.length !== 0 ?
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={request && request.status === "pending"}
                onRefresh={this.refresh}
              />
            }
          >
            { reportState ? <StateComponent value={value} state={reportState} /> : null}
            { controlState ? <StateComponent value={value} state={controlState} /> : null}
          </ScrollView> :
          request && request.status === "pending" ?
          null :
          <Fragment>
            <TouchableOpacity style={[theme.common.button, theme.common.roundOutline, theme.common.row, {backgroundColor: "white", justifyContent: 'center'}]} onPress={this.refresh}>
              <Icon name="rotate-cw" size={20} color={theme.variables.primary} style={{marginRight: 20}}/>
              <Text>Refresh</Text>
            </TouchableOpacity>
            <Text>List is empty</Text>
          </Fragment>
        }
        <RequestError error={error} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    margin: 2
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(StatesComponent);
