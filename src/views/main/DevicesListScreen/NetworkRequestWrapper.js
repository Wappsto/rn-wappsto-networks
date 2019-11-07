import {PureComponent} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {makeRequest} from '../../../wappsto-redux/actions/request';
import {setItem} from '../../../wappsto-redux/actions/items';
import {getRequest} from '../../../wappsto-redux/selectors/request';
import {getItem} from '../../../wappsto-redux/selectors/items';

function mapStateToProps(state, componentProps) {
  const addNetworkId = getItem(state, 'addNetworkId');
  const url = '/network/' + addNetworkId;
  const postRequest = addNetworkId && getRequest(state, url, 'POST');
  return {
    postRequest,
    url,
    networkId: addNetworkId,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({makeRequest, setItem}, dispatch),
  };
}

class AddNetworkWrapper extends PureComponent {
  componentDidUpdate(prevProps) {
    // hide popup when request is successfull
    const postRequest = this.props.postRequest;
    const manufacturerAsOwnerError =
      postRequest &&
      postRequest.status === 'error' &&
      postRequest.json.code === 105000008;
    if (
      prevProps.postRequest &&
      prevProps.postRequest.status === 'pending' &&
      postRequest &&
      (postRequest.status === 'success' || manufacturerAsOwnerError)
    ) {
      this.props.hide(manufacturerAsOwnerError);
      if (!manufacturerAsOwnerError) {
        this.props.setItem('refreshList', val => (val ? val + 1 : 1));
      }
    }
  }

  sendRequest = (id, body = {}) => {
    if (id) {
      this.props.setItem('addNetworkId', id);
      this.props.makeRequest({
        method: 'POST',
        url: '/network/' + id,
        body,
      });
    }
  };

  render() {
    return this.props.children(this.sendRequest, this.props);
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNetworkWrapper);
