import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import i18n, { CapitalizeFirst } from '@/translations';
import theme from '@/theme/themeExport';
import RequestError from '@/components/RequestError';
import useSetupDevice from '@/hooks/useSetupDevice';

const SetupDevice = React.memo(({ next, previous, hide, ssid, password, selectedDevice, sendRequest, postRequest, skipCodes, acceptedManufacturerAsOwner }) => {
  const { loading, error, step } = useSetupDevice(selectedDevice, sendRequest, postRequest, acceptedManufacturerAsOwner, ssid, password);
  return (
    <>
      <Text style={[theme.common.H3, error && theme.common.error]}>{CapitalizeFirst(i18n.t(loading ? 'blufi.settingUp' : (error ? 'blufi.error.title' : 'blufi.done')))}</Text>
      {loading && (
        <>
          <ActivityIndicator size='large' color={theme.variables.primary} style={theme.common.spaceAround}/>
          <Text>{CapitalizeFirst(i18n.t('blufi.step.' + step))}</Text>
        </>
      )}
      {error && <Text style={theme.common.error}>{CapitalizeFirst(i18n.t('blufi.error.' + step))}</Text>}
      <RequestError request={postRequest} skipCodes={skipCodes} />
      {!loading && !error &&
        <>
          <Text>{CapitalizeFirst(i18n.t('blufi.doneDescription'))}</Text>
          <TouchableOpacity onPress={hide}>
            <Text style={theme.common.success}>{CapitalizeFirst(i18n.t('done'))}</Text>
          </TouchableOpacity>
        </>
      }
    </>
  );
});

export default SetupDevice;
