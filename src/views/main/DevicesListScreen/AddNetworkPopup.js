import React, {PureComponent} from 'react';
import {
  Text,
  TextInput,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {makeRequest} from 'wappsto-redux/actions/request';
import {setItem} from 'wappsto-redux/actions/items';
import {getRequest} from 'wappsto-redux/selectors/request';
import {getItem} from 'wappsto-redux/selectors/items';
import i18n, {
  CapitalizeFirst,
  CapitalizeEach,
} from '../../../translations/i18n';

function mapStateToProps(state, componentProps) {
  const addNetworkId = getItem(state, 'addNetworkId');
  const url = '/network/' + addNetworkId;
  const postRequest = addNetworkId && getRequest(state, url, 'POST');
  return {
    postRequest,
    url,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators({makeRequest, setItem}, dispatch),
  };
}

class AddNetworkPopup extends PureComponent {
  state = {
    inputValue: '',
    isScanning: false,
  };

  componentDidUpdate(prevProps) {
    // hide popup when request is successfull
    const postRequest = this.props.postRequest;
    if (
      prevProps.postRequest &&
      prevProps.postRequest.status === 'pending' &&
      postRequest &&
      postRequest.status === 'success'
    ) {
      this.props.hide();
      this.props.setItem('refreshList', val => (val ? val + 1 : 1));
    }
  }

  onRead = event => {
    this.setState(state => {
      return {
        inputValue: (event.data.split('+')[0].split(':')[1] || '').trim(),
        isScanning: false,
      };
    });
  };

  addNetwork = () => {
    console.log('/network/' + this.state.inputValue);
    this.props.setItem('addNetworkId', this.state.inputValue);
    this.props.makeRequest({
      method: 'POST',
      url: '/network/' + this.state.inputValue,
      body: {},
    });
  };

  switchView = () => {
    this.setState(state => ({
      isScanning: !state.isScanning,
    }));
  };

  render() {
    const postRequest = this.props.postRequest;
    const loading = postRequest && postRequest.status === 'pending';
    return (
      <>
        <Text style={theme.common.spaceBottom}>
          {CapitalizeEach(i18n.t('addNetworkPopup.addNetworkText'))}
        </Text>
        <View style={theme.common.spaceBottom}>
          {this.state.isScanning ? (
            <RNCamera
              style={[styles.box, styles.camera]}
              barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
              onBarCodeRead={this.onRead}
              notAuthorizedView={
                <View style={[styles.box, styles.buttonBoxBackground]}>
                  <Text>
                    {CapitalizeFirst(
                      i18n.t('addNetworkPopup.cameraPermission.denied'),
                    )}
                  </Text>
                </View>
              }
              pendingAuthorizationView={
                <View style={[styles.box, styles.buttonBoxBackground]}>
                  <Text>
                    {CapitalizeFirst(
                      i18n.t('addNetworkPopup.cameraPermission.pending'),
                    )}
                  </Text>
                </View>
              }
              androidCameraPermissionOptions={{
                title: CapitalizeFirst(
                  i18n.t('addNetworkPopup.cameraPermission.title'),
                ),
                message: CapitalizeFirst(
                  i18n.t('addNetworkPopup.cameraPermission.message'),
                ),
              }}
              captureAudio={false}>
              <BarcodeMask
                width={styles.box.width - 20}
                height={styles.box.height - 30}
                showAnimatedLine={false}
              />
            </RNCamera>
          ) : (
            <TouchableOpacity
              style={[styles.box, styles.buttonBoxBackground]}
              onPress={this.switchView}>
              <Text>
                {CapitalizeFirst(i18n.t('addNetworkPopup.scanQRCode'))}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          style={theme.common.input}
          onChangeText={inputValue => this.setState({inputValue})}
          value={this.state.inputValue}
          textContentType="emailAddress"
          autoCapitalize="none"
          onSubmitEditing={this.moveToPasswordField}
          keyboardType="email-address"
          returnKeyType="next"
          disabled={loading}
        />
        {loading && (
          <ActivityIndicator size="large" color={theme.variables.primary} />
        )}
        <RequestError error={postRequest} />
        <TouchableOpacity
          style={[theme.common.button, loading ? theme.common.disabled : null]}
          onPress={this.addNetwork}>
          <Text style={theme.common.btnText}>
            {CapitalizeFirst(i18n.t('add'))}
          </Text>
        </TouchableOpacity>
      </>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNetworkPopup);

const styles = StyleSheet.create({
  box: {
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: 200,
  },
  camera: {
    backgroundColor: 'transparent',
  },
  buttonBoxBackground: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'black',
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
  },
});
