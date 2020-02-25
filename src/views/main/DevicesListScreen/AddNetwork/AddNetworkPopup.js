import React from 'react';
import { Text, TextInput, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RequestError from '@/components/RequestError';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '@/translations';
import useAddNetwork from '@/hooks/useAddNetwork';

const styles = StyleSheet.create({
  qrCodeScannerWrapper: {
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

const AddNetwork = React.memo(({ postRequest, sendRequest, skipCodes, acceptedManufacturerAsOwner, hide }) => {
  const {
    inputValue,
    setInputValue,
    switchView,
    isScanning,
    didScan,
    onRead,
    onSubmitEditing,
    addNetwork,
    loading,
    canAdd 
  } = useAddNetwork(sendRequest, postRequest, acceptedManufacturerAsOwner, hide);

  return (
    <>
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
        disabled={!canAdd}
        style={[theme.common.button, canAdd ? null : theme.common.disabled]}
        onPress={addNetwork}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(i18n.t('add'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default AddNetwork;
