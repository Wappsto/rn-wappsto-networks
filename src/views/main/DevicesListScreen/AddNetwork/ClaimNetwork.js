import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { BarcodeFormat, BarcodeValueType, useScanBarcodes } from 'vision-camera-code-scanner';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import RequestError from '../../../../components/RequestError';
import Text from '../../../../components/Text';
import useAddNetworkForm from '../../../../hooks/setup/useAddNetworkForm';
import theme from '../../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../../translations';

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

const ScanButton = ({ didScan, onPress }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.cameraCapture} onPress={onPress}>
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
  );
};

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

  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const bookmark = barcodes.find(
        c => c.content.type === BarcodeValueType.URL || c.content.type === BarcodeValueType.TEXT,
      )?.content.data;

      if (bookmark?.hasOwnProperty('url')) {
        onRead(bookmark.url ?? '');
      } else {
        onRead(bookmark);
      }
    }
  }, [barcodes, onRead]);

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
        {hasPermission ? (
          isScanning && device ? (
            <Camera
              isActive
              device={device}
              style={styles.cameraPreview}
              frameProcessor={frameProcessor}
              frameProcessorFps={5}
            />
          ) : (
            <ScanButton didScan={didScan} onPress={switchView} />
          )
        ) : (
          <View style={styles.cameraCapture}>
            <Text
              color={theme.variables.alert}
              content={CapitalizeFirst(t('onboarding.claimNetwork.cameraPermission.denied'))}
            />
          </View>
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
        onChangeText={text => setInputValue(text)}
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
