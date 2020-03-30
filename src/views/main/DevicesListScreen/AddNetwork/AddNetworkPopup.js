import React from 'react';
import { Text, TextInput, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RequestError from '../../../../components/RequestError';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../../translations';
import useAddNetworkForm from '../../../../hooks/useAddNetworkForm';

const styles = StyleSheet.create({
  qrCodeScannerWrapper: {
    height: 160,
    marginBottom: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraCapture: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});

const AddNetwork = React.memo(({ postRequest, sendRequest, skipCodes, acceptedManufacturerAsOwner, hide }) => {
  const { t } = useTranslation();
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
  } = useAddNetworkForm(sendRequest, postRequest, acceptedManufacturerAsOwner, hide);

  return (
    <>
      <Text style={theme.common.H3}>
        {CapitalizeEach(t('onboarding.claiming.addNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(t('onboarding.claiming.addNetworkInfo'))}
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
                    t('onboarding.claiming.cameraPermission.denied'),
                  )}
                </Text>
              </View>
            }
            pendingAuthorizationView={
              <View style={styles.cameraCapture}>
                <Text>
                  {CapitalizeFirst(
                    t('onboarding.claiming.cameraPermission.pending'),
                  )}
                </Text>
              </View>
            }
            androidCameraPermissionOptions={{
              title: CapitalizeFirst(
                t('onboarding.claiming.cameraPermission.title'),
              ),
              message: CapitalizeFirst(
                t('onboarding.claiming.cameraPermission.message'),
              ),
            }}>
            <BarcodeMask
              width={180}
              height={160}
              edgeColor={theme.variables.primary}
              showAnimatedLine={false}
            />
          </RNCamera>
        ) : (
          <TouchableOpacity
            style={styles.cameraCapture}
            onPress={switchView}>
            <Text>{CapitalizeFirst(t(didScan ? 'onboarding.claiming.rescanQRCode' : 'onboarding.claiming.scanQRCode'))}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={theme.common.label}>
        {CapitalizeFirst(t('onboarding.claiming.uuidLabel'))}
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
          {CapitalizeFirst(t('add'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default AddNetwork;
