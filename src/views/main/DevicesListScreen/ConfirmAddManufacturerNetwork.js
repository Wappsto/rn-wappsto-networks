import React from 'react';
import { Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '../../../translations';

const ConfirmAddManufacturerNetwork = React.memo(({ acceptManufacturerAsOwner, postRequest }) => {
  const loading = postRequest && postRequest.status === 'pending';
  return (
    <>
      <Text style={theme.common.H3}>
        {CapitalizeEach(i18n.t('addNetwork.addManufacturerNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(i18n.t('addNetwork.manufacturerAsOwnerWarning'))}
      </Text>
      {loading && (
        <ActivityIndicator size='large' color={theme.variables.primary} />
      )}
      {postRequest && postRequest.json && postRequest.json.code !== 105000008 && <RequestError request={postRequest} />}
      <TouchableOpacity
        style={[theme.common.button, loading ? theme.common.disabled : null]}
        onPress={acceptManufacturerAsOwner}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(i18n.t('yes'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default ConfirmAddManufacturerNetwork;
