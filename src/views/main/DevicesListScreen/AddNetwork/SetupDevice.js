import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import theme from '../../../../theme/themeExport';
import RequestError from '../../../../components/RequestError';
import useSetupDevice from '../../../../hooks/useSetupDevice';

const SetupDevice = React.memo(({ next, previous, hide, ssid, password, selectedDevice, sendRequest, postRequest, skipCodes, acceptedManufacturerAsOwner }) => {
  const { t } = useTranslation();
  const { loading, error, step } = useSetupDevice(selectedDevice, sendRequest, postRequest, acceptedManufacturerAsOwner, ssid, password);
  return (
    <>
      <Text style={[theme.common.H3, error && theme.common.error]}>{CapitalizeFirst(t(loading ? 'blufi.settingUp' : (error ? 'blufi.error.title' : 'blufi.done')))}</Text>
      {loading && (
        <>
          <ActivityIndicator size='large' color={theme.variables.primary} style={theme.common.spaceAround}/>
          <Text>{CapitalizeFirst(t('blufi.step.' + step))}</Text>
        </>
      )}
      {error && <Text style={theme.common.error}>{CapitalizeFirst(t('blufi.error.' + step))}</Text>}
      <RequestError request={postRequest} skipCodes={skipCodes} />
      {!loading && !error &&
        <>
          <Text>{CapitalizeFirst(t('blufi.doneDescription'))}</Text>
          <TouchableOpacity onPress={hide}>
            <Text style={theme.common.success}>{CapitalizeFirst(t('done'))}</Text>
          </TouchableOpacity>
        </>
      }
    </>
  );
});

export default SetupDevice;
