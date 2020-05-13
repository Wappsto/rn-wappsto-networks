import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import RequestError from '../../../../components/RequestError';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../../translations';
import useAddNetworkForm from '../../../../hooks/setup/useAddNetworkForm';

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
      <Text
        size='h3'
        content={CapitalizeEach(t('onboarding.claiming.addNetworkTitle'))}
      />
      <Text
        size='p'
        content={CapitalizeFirst(t('onboarding.claiming.addNetworkInfo'))}
      />
      <View style={styles.qrCodeScannerWrapper}>
        {isScanning ? (
          <RNCamera
            captureAudio={false}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            style={styles.cameraPreview}
            onBarCodeRead={onRead}
            notAuthorizedView={
              <View style={styles.cameraCapture}>
                <Text
                  content={CapitalizeFirst(t('onboarding.claiming.cameraPermission.denied'))}
                />
              </View>
            }
            pendingAuthorizationView={
              <View style={styles.cameraCapture}>
                <Text
                  content={CapitalizeFirst(t('onboarding.claiming.cameraPermission.pending'))}
                />
              </View>
            }
            androidCameraPermissionOptions={{
              title: CapitalizeFirst(t('onboarding.claiming.cameraPermission.title')),
              message: CapitalizeFirst(t('onboarding.claiming.cameraPermission.message')),
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
            <Text
              content={CapitalizeFirst(t(didScan ? 'onboarding.claiming.rescanQRCode' : 'onboarding.claiming.scanQRCode'))}
            />
          </TouchableOpacity>
        )}
      </View>
      <Input
        label={CapitalizeFirst(t('onboarding.claiming.uuidLabel'))}
        onChangeText={text => setInputValue(text)}
        value={inputValue}
        autoCapitalize='none'
        onSubmitEditing={onSubmitEditing}
        returnKeyType='done'
        disabled={loading}
      />
      {loading && (
        <ActivityIndicator size='large'  color={theme.variables.spinnerColor} />
      )}
      <RequestError request={postRequest} skipCodes={skipCodes} />
      <Button
        disabled={!canAdd}
        display='block'
        color={canAdd ? 'primary' : 'disabled'}
        onPress={addNetwork}
        text={CapitalizeFirst(t('add'))}
      />
    </>
  );
});

export default AddNetwork;
