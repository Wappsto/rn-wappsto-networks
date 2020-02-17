import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '@/translations';

const ConfirmAddManufacturerNetwork = React.memo(({ acceptManufacturerAsOwner }) => {
  return (
    <>
      <Text style={theme.common.H3}>
        {CapitalizeEach(i18n.t('addNetwork.addManufacturerNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(i18n.t('addNetwork.manufacturerAsOwnerWarning'))}
      </Text>
      <TouchableOpacity
        style={theme.common.button}
        onPress={acceptManufacturerAsOwner}>
        <Text style={theme.common.btnText}>
          {CapitalizeFirst(i18n.t('yes'))}
        </Text>
      </TouchableOpacity>
    </>
  );
});

export default ConfirmAddManufacturerNetwork;
