import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Component} from 'react';

import {makeRequest, removeRequest} from '../wappsto-redux/actions/request';
import {addSession} from '../wappsto-redux/actions/session';
import {initializeStream} from '../wappsto-redux/actions/stream';

import {getRequest} from '../wappsto-redux/selectors/request';

function mapStateToProps(state, componentProps) {
  const session = componentProps.session;
  return {
    verifyRequest:
      session && getRequest(state, '/session/' + session.meta.id, 'GET'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(
      {makeRequest, addSession, removeRequest, initializeStream},
      dispatch,
    ),
  };
}

export class SessionVerifier extends Component {
  componentDidMount() {
    this.addMinimumTimeout();
    this.addMaximumTimeout();
    this.verify();
  }
  addMinimumTimeout() {
    this.minimumTimeout = setTimeout(() => {
      this.timeoutEnded = true;
      if (this.props.status !== 'pending') {
        if (this.sessionStatus === 'error') {
          this.navigateTo('LoginScreen');
        } else if (this.sessionStatus === 'success') {
          this.navigateTo('MainScreen');
        }
      }
    }, 500);
  }
  addMaximumTimeout() {
    this.maximumTimeout = setTimeout(() => {
      this.navigateTo('LoginScreen');
    }, 10000);
  }
  clearTimeouts() {
    clearTimeout(this.minimumTimeout);
    clearTimeout(this.maximumTimeout);
  }
  checkSession() {
    if (this.props.session) {
      const id = this.props.session.meta.id;
      this.props.makeRequest('GET', '/session/' + id, null, {
        headers: {'x-session': id},
      });
    }
  }
  componentDidUpdate() {
    this.verify();
  }
  verify() {
    const {verifyRequest, session, status} = this.props;
    if (!this.done) {
      if (status === 'error') {
        this.sessionStatus = 'error';
        if (this.timeoutEnded) {
          this.navigateTo('LoginScreen');
        }
      }
      if (!verifyRequest && session) {
        this.checkSession();
      }
      if (verifyRequest) {
        this.sessionStatus = verifyRequest.status;
        if (verifyRequest.status === 'success') {
          if (this.timeoutEnded && !this.done) {
            this.done = true;
            this.userLogged(verifyRequest, session);
          }
        } else if (verifyRequest.status === 'error') {
          this.navigateTo('LoginScreen');
        }
      }
    }
  }
  userLogged(request, session) {
    this.props.addSession(session.json);
    this.props.removeRequest(request.url);
    this.navigateTo('MainScreen');
  }
  navigateTo(page) {
    this.clearTimeouts();
    this.props.navigate(page);
  }
  render() {
    return null;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionVerifier);
