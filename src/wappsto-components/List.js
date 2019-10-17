import { connect as reduxConnect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Component } from 'react';

import * as items from '../wappsto-redux/actions/items';
import * as request from '../wappsto-redux/actions/request';

import { getRequest } from '../wappsto-redux/selectors/request';
import { getEntities } from '../wappsto-redux/selectors/entities';
import { getItem } from '../wappsto-redux/selectors/items';
import { isUUID } from '../wappsto-redux/util/helpers';

function getQueryObj(query) {
	var urlParams = {};
  var match,
      pl     = /\+/g,
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };

  while ((match = search.exec(query)))
     urlParams[decode(match[1])] = decode(match[2]);
	return urlParams;
}

function mapStateToProps(state, componentProps){
  let { type, id, childType, sort, url } = componentProps;
  let parent, entitiesType;
  let query = { ...componentProps.query };
  if(url){
    let split = url.split("?");
    url = split[0];
    query = { ...query, ...getQueryObj(split.slice(1).join("?")) };
    split = split[0].split("/");
    if(isUUID(split[split.length - 1])){
      id = split[split.length - 1];
      type = split[split.length - 2];
      entitiesType = type;
    } else {
      if(isUUID(split[split.length - 2]) && split.length > 2){
        type = split[split.length - 3];
        id = split[split.length - 2];
        childType = split[split.length - 1];
        entitiesType = childType;
      } else {
        type = split[split.length - 1];
        entitiesType = type;
      }
    }
  } else {
    url = "/" + type;
    if(id){
      if(id.startsWith("?")){
        query = { ...query, ...getQueryObj(id.slice(1)) };
      } else {
        if(!id.startsWith("/")){
          url += "/";
        }
        url += id;
      }
    }
    if(childType){
      url += "/" + childType;
      parent = { id, type };
      entitiesType = childType;
    } else {
      entitiesType = type;
    }
  }
  let request = getRequest(state, url, "GET");
  let items;
  if(!request
    || request.status === "error"
    || (request.status === "pending" && !request.url.includes("offset") && !request.options.query.hasOwnProperty("offset"))
  ){
    items = [];
  } else {
    items = getEntities(state, entitiesType, { parent });
  }
  if(sort){
    items.sort(sort);
  }
  return {
    type: type,
    childType: childType,
    entitiesType: entitiesType,
    id: id,
    url: url,
    request: request,
    items: items,
    fetched: getItem(state, url + "_fetched"),
    length: getItem(state, url + "_length"),
    query: query
  }
}

function mapDispatchToProps(dispatch){
  return {
    ...bindActionCreators({...request, ...items}, dispatch)
  }
}

export class List extends Component {
  constructor(props){
    super(props);
    this.state = {
      canLoadMore: false
    };
    this.refresh = this.refresh.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.offset = this.props.query.offset || 0;
    this.limit = this.props.query.limit || 50;
    this.canLoadMore = false;
  }

  componentDidMount(){
    if(!this.props.fetched
      || this.props.length !== this.props.items.length
      || (this.props.request && this.props.request.status === "error")){
      this.props.setItem(this.props.url + "_fetched", true);
      this.refresh();
    }
  }

  componentDidUpdate(prevProps){
    this.updateItemCount(prevProps);
    this.updateListLoadMore(prevProps);
    if(this.props.url !== prevProps.url || this.props.id !== prevProps.id || JSON.stringify(this.props.query) !== JSON.stringify(prevProps.query)){
      this.refresh();
    }
  }

  updateItemCount(prevProps){
    let request = this.props.request;
    let prevRequest = prevProps.request;
    if(prevRequest && prevRequest.status === "pending" && request && request.status === "success"){
      this.props.setItem(this.props.url + "_length", this.props.items.length);
    }
  }

  updateListLoadMore(prevProps){
    let list = this.props.items;
    let request = this.props.request;
    let prevRequest = prevProps.request;
    if(request && prevRequest && prevRequest.status !== "success" && request.status === "success"){
      if(list.length && this.offset !== list.length && list.length % this.limit === 0){
        this.setState({
          canLoadMore: true
        });
      } else {
        this.setState({
          canLoadMore: false
        });
      }
      this.offset = list.length + (this.props.query.offset || 0);
    }
  }

  loadMore(){
    if(this.state.canLoadMore){
      this.makeRequest({
        query: {
          expand: 0,
          ...this.props.query,
          offset: this.offset
        }
      });
    }
  }

  refresh(){
    this.offset = this.props.query.offset || 0;
    this.makeRequest({
      query: {
        expand: 0,
        ...this.props.query
      },
      reset: true
    });
  }

  makeRequest(options){
    let request = this.props.request;
    if(!request || request.status !== "pending"){
      this.props.makeRequest("GET", this.props.url, null, options);
    }
  }
}

function emptyFunc(){ return {} }

export function connect(component, extraState, extraDispatch){
  if(!extraState) extraState = emptyFunc;
  if(!extraDispatch) extraDispatch = emptyFunc;
  return reduxConnect(
    (state, componentProps) => ({
      ...mapStateToProps(state, componentProps),
      ...extraState(state, componentProps)
    }),
    (dispatch) => ({
      ...mapDispatchToProps(dispatch),
      ...extraDispatch(dispatch)
    })
   )(component);
}

export default connect(List);
