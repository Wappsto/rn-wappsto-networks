import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../../translations';

const ConfirmAddManufacturerNetwork = React.memo(({ accept, reject }) => {
  const { t } = useTranslation();
  return (
    <>
      <Text style={theme.common.H3}>
        {CapitalizeEach(t('addNetwork.addManufacturerNetworkTitle'))}
      </Text>
      <Text style={theme.common.p}>
        {CapitalizeFirst(t('addNetwork.manufacturerAsOwnerWarning'))}
      </Text>
      <View style={theme.common.btnGroup}>
        <TouchableOpacity
          style={[theme.common.button, theme.common.errorPanel]}
          onPress={reject}>
          <Text style={theme.common.btnText}>
            {CapitalizeFirst(t('no'))}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.common.button, theme.common.spaceLeft]}
          onPress={accept}>
          <Text style={theme.common.btnText}>
            {CapitalizeFirst(t('yes'))}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
});

export default ConfirmAddManufacturerNetwork;
