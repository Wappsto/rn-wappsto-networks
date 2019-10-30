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
import i18n, {
  CapitalizeFirst,
  CapitalizeEach,
} from '../../../translations/i18n';

class AddNetwork extends PureComponent {
  state = {
    inputValue: '',
    isScanning: false,
  };

  onRead = event => {
    this.setState(state => {
      return {
        inputValue: (event.data.split('+')[0].split(':')[1] || '').trim(),
        isScanning: false,
      };
    });
  };

  addNetwork = () => {
    this.props.sendRequest(this.state.inputValue);
  };

  switchView = () => {
    this.setState(state => ({
      isScanning: !state.isScanning,
    }));
  };

  render() {
    const postRequest = this.props.postRequest;
    const loading = postRequest && postRequest.status === 'pending';
    const manufacturerAsUserError =
      postRequest &&
      postRequest.status === 'error' &&
      postRequest.json.code === 105000008;
    return (
      <>
        <Text style={theme.common.H3}>
          {CapitalizeEach(i18n.t('addNetwork.addNetworkTitle'))}
        </Text>
        <Text style={theme.common.p}>
          {CapitalizeFirst(i18n.t('addNetwork.addNetworkInfo'))}
        </Text>
        <View style={styles.qrCodeScannerWrapper}>
          {this.state.isScanning ? (
            <RNCamera
              captureAudio={false}
              barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
              style={styles.cameraPreview}
              onBarCodeRead={this.onRead}
              notAuthorizedView={
                <View style={styles.cameraCapture}>
                  <Text>
                    {CapitalizeFirst(
                      i18n.t('addNetwork.cameraPermission.denied'),
                    )}
                  </Text>
                </View>
              }
              pendingAuthorizationView={
                <View style={styles.cameraCapture}>
                  <Text>
                    {CapitalizeFirst(
                      i18n.t('addNetwork.cameraPermission.pending'),
                    )}
                  </Text>
                </View>
              }
              androidCameraPermissionOptions={{
                title: CapitalizeFirst(
                  i18n.t('addNetwork.cameraPermission.title'),
                ),
                message: CapitalizeFirst(
                  i18n.t('addNetwork.cameraPermission.message'),
                ),
              }}>
              <BarcodeMask
                width={140}
                height={140}
                edgeColor={theme.variables.primary}
                showAnimatedLine={false}
              />
            </RNCamera>
          ) : (
            <TouchableOpacity
              style={styles.cameraCapture}
              onPress={this.switchView}>
              <Text>{CapitalizeFirst(i18n.t('addNetwork.scanQRCode'))}</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={theme.common.label}>
          {CapitalizeFirst(i18n.t('addNetwork.uuid'))}
        </Text>
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
        {!manufacturerAsUserError && <RequestError error={postRequest} />}
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

export default AddNetwork;

const styles = StyleSheet.create({
  qrCodeScannerWrapper: {
    flex: 1,
    height: 140,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: theme.variables.borderRadiusBase,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraCaptureWrapper: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'yellow',
  },
  cameraCapture: {
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});
