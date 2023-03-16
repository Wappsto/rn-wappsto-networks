import React from 'react';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import RequestError from '../../../../components/RequestError';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import useAddNetworkForm from '../../../../hooks/setup/useAddNetworkForm';

const styles = StyleSheet.create({
  qrCodeScannerWrapper: {
    height: 240,
    marginBottom: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  cameraPreview: {
    flex: 1,
  },
  cameraCapture: {
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  button: {
    marginTop: 30,
  },
  statusMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: 30,
  },
  inlineIcon: {
    marginRight: 8,
  },
});

const AddNetwork = React.memo(({ addNetworkHandler, hide }) => {
  const { t } = useTranslation();
  const {
    inputValue,
    setInputValue,
    switchView,
    isScanning,
    didScan,
    scanError,
    onRead,
    onSubmitEditing,
    addNetwork,
    loading,
    canAdd,
  } = useAddNetworkForm(addNetworkHandler, hide);

  return (
    <>
      <Text
        size="h3"
        align="center"
        content={CapitalizeFirst(t('onboarding.claimNetwork.claimNetworkTitle'))}
      />
      <Text
        size="p"
        color="secondary"
        content={CapitalizeFirst(t('onboarding.claimNetwork.claimNetworkInfo'))}
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
                  content={CapitalizeFirst(t('onboarding.claimNetwork.cameraPermission.denied'))}
                />
              </View>
            }
            pendingAuthorizationView={
              <View style={styles.cameraCapture}>
                <Text
                  content={CapitalizeFirst(t('onboarding.claimNetwork.cameraPermission.pending'))}
                />
              </View>
            }
            androidCameraPermissionOptions={{
              title: CapitalizeFirst(t('onboarding.claimNetwork.cameraPermission.title')),
              message: CapitalizeFirst(t('onboarding.claimNetwork.cameraPermission.message')),
            }}>
            <BarcodeMask
              width="100%"
              height={240}
              edgeColor={theme.variables.primary}
              showAnimatedLine={false}
            />
          </RNCamera>
        ) : (
          <TouchableOpacity style={styles.cameraCapture} onPress={switchView}>
            {didScan ? (
              <>
                <View style={styles.statusMessage}>
                  <Icon
                    name="check-circle"
                    size={18}
                    color={theme.variables.success}
                    style={styles.inlineIcon}
                  />
                  <Text
                    color={theme.variables.success}
                    content={CapitalizeFirst(t('onboarding.claimNetwork.scanSuccessMessage'))}
                  />
                </View>
                <Text
                  color="secondary"
                  content={CapitalizeFirst(t('onboarding.claimNetwork.rescanQRCode'))}
                />
              </>
            ) : (
              <Text content={CapitalizeFirst(t('onboarding.claimNetwork.scanQRCode'))} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {scanError && (
        <Text
          size="p"
          color="error"
          content={CapitalizeFirst(t('onboarding.claimNetwork.' + scanError))}
        />
      )}
      <Input
        label={CapitalizeFirst(t('onboarding.claimNetwork.uuidLabel'))}
        onChangeText={(text) => setInputValue(text)}
        value={inputValue}
        autoCapitalize="none"
        onSubmitEditing={onSubmitEditing}
        returnKeyType="done"
        disabled={loading}
      />
      <Text
        size={12}
        color="secondary"
        content={CapitalizeFirst(t('onboarding.claimNetwork.enterUUID'))}
      />
      {loading && <ActivityIndicator size="large" color={theme.variables.spinnerColor} />}
      <RequestError
        request={addNetworkHandler.request}
        skipCodes={addNetworkHandler.skipErrorCodes}
      />
      <Button
        disabled={!canAdd}
        display="block"
        color={canAdd ? 'primary' : 'disabled'}
        onPress={addNetwork}
        style={styles.button}
        text={CapitalizeFirst(t('onboarding.claimNetwork.claimNetworkBtn'))}
      />
    </>
  );
});

export default AddNetwork;
