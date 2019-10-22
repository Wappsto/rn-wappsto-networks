import {connect as reduxConnect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';

import * as request from '../wappsto-redux/actions/request';
import * as session from '../wappsto-redux/actions/session';
import * as stream from '../wappsto-redux/actions/stream';

import {getRequest} from '../wappsto-redux/selectors/request';

function mapStateToProps(state, componentProps) {
  let session = componentProps.navigation.getParam('session', null);
  return {
    postRequest: getRequest(state, '/session', 'POST'),
    verifyRequest:
      session && getRequest(state, '/session/' + session.meta.id, 'GET'),
    session: session,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({...request, ...session, ...stream}, dispatch),
  };
}

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember_me: true,
      isSigninInProgress: false,
      showPassword: false,
    };

    this.signIn = this.signIn.bind(this);
    this.toggleShowPassword = this.toggleShowPassword.bind(this);
  }
  componentDidMount() {
    this.checkSession();
  }
  checkSession() {
    if (this.props.session) {
      let id = this.props.session.meta.id;
      this.props.makeRequest('GET', '/session/' + id, null, {
        headers: {'x-session': id},
      });
    }
  }
  signIn() {
    this.props.makeRequest('POST', '/session', {
      username: this.state.username,
      password: this.state.password,
      remember_me: this.state.remember_me,
    });
  }
  componentDidUpdate() {
    const postRequest = this.props.postRequest;
    const verifyRequest = this.props.verifyRequest;
    if (postRequest && postRequest.status === 'success') {
      this.userLogged(postRequest);
    } else if (verifyRequest && verifyRequest.status === 'success') {
      this.props.addSession(session.json);
      this.userLogged(verifyRequest);
    }
  }
  userLogged(request) {
    this.props.removeRequest(request.url);
    this.startStream(request.json);
    this.saveSession(request);
    this.navigateToMain(request);
  }
  startStream(session) {
    if (this.stream) {
      this.props.initializeStream(this.stream, session.meta.id);
    } else {
      console.log(
        'stream object not defined in login page, stream was not initialized',
      );
    }
  }
  toggleShowPassword() {
    this.setState((state, props) => ({
      showPassword: !state.showPassword,
    }));
  }
}

function emptyFunc() {
  return {};
}

export function connect(
  component,
  extraState = emptyFunc,
  extraDispatch = emptyFunc,
) {
  return reduxConnect(
    (state, componentProps) => ({
      ...mapStateToProps(state, componentProps),
      ...extraState(state, componentProps),
    }),
    dispatch => ({
      ...mapDispatchToProps(dispatch),
      ...extraDispatch(dispatch),
    }),
  )(component);
}

export default connect(Login);
