import React, { useState } from 'react';
import { Text, TextInput, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RequestError from '@/components/RequestError';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '@/translations';
import { manufacturerAsOwnerErrorCode } from '@/util/params';
import { isUUID } from 'wappsto-redux/util/helpers';

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

const skipCodes = [manufacturerAsOwnerErrorCode];
const AddNetwork = React.memo(({ postRequest, sendRequest }) => {
  const [ inputValue, setInputValue ] = useState('');
  const [ isScanning, setIsScanning ] = useState(false);
  const [ didScan, setDidScan ] = useState(false);

  const onRead = event => {
    const qrText = (event.data.split('+')[0] || '').trim();
    setInputValue(qrText);
    setIsScanning(false);
    setDidScan(true);
  };

  const addNetwork = () => {
    sendRequest(inputValue);
  };

  const switchView = () => {
    setIsScanning(v => !v);
  };

  const onSubmitEditing = () => {
    if(isUUID(inputValue)){
      addNetwork();
    }
  }

  const loading = postRequest && postRequest.status === 'pending';
  return (
    <View style={theme.common.fullScreenModalContent}>
      <Text style={theme.common.H3}>
        {CapitalizeEach(i18n.t('addNetwork.addNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(i18n.t('addNetwork.addNetworkInfo'))}
      </Text>
      <View style={styles.qrCodeScannerWrapper}>
        {isScanning ? (
          <RNCamera
            captureAudio={false}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            style={styles.cameraPreview}
            onBarCodeRead={onRead}
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
            onPress={switchView}>
            <Text>{CapitalizeFirst(i18n.t(didScan ? 'addNetwork.rescanQRCode' : 'addNetwork.scanQRCode'))}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={theme.common.label}>
        {CapitalizeFirst(i18n.t('addNetwork.uuid'))}
      </Text>
      <TextInput
        style={theme.common.input}
        onChangeText={text => setInputValue(text)}
        value={inputValue}
        autoCapitalize='none'
        onSubmitEditing={onSubmitEditing}
        returnKeyType='done'
        disabled={loading}
      />
      {loading && (
        <ActivityIndicator size='large' color={theme.variables.primary} />
      )}
      <RequestError request={postRequest} skipCodes={skipCodes} />
      <TouchableOpacity
        disabled={!isUUID(inputValue) || loading}
        style={[theme.common.button, !isUUID(inputValue) || loading ? theme.common.disabled : null]}
        onPress={addNetwork}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(i18n.t('add'))}
        </Text>
      </TouchableOpacity>
    </View>
  );
});

export default AddNetwork;
