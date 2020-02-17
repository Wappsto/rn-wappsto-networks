import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import theme from '@/theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '@/translations';

const ConfirmAddManufacturerNetwork = React.memo(({ accept, reject }) => {
  return (
    <>
      <Text style={theme.common.H3}>
        {CapitalizeEach(i18n.t('addNetwork.addManufacturerNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(i18n.t('addNetwork.manufacturerAsOwnerWarning'))}
      </Text>
      <View style={theme.common.btnGroup}>
        <TouchableOpacity
          style={[theme.common.button, theme.common.errorPanel]}
          onPress={reject}>
          <Text style={theme.common.btnText}>
            {CapitalizeFirst(i18n.t('no'))}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.common.button, theme.common.spaceLeft]}
          onPress={accept}>
          <Text style={theme.common.btnText}>
            {CapitalizeFirst(i18n.t('yes'))}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
});

export default ConfirmAddManufacturerNetwork;
