import React from 'react';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../../translations';
import ConfirmationPopup from '../../../../components/ConfirmationPopup';
import theme from '../../../../theme/themeExport';

const ConfirmAddManufacturerNetwork = React.memo(({ visible, accept, reject }) => {
  const { t } = useTranslation();
  return (
    <ConfirmationPopup
      title={CapitalizeEach(t('addNetwork.addManufacturerNetworkTitle'))}
      description={CapitalizeFirst(t('addNetwork.manufacturerAsOwnerWarning'))}
      visible={visible}
      accept={accept}
      reject={reject}
      rejectStyle={theme.common.errorPanel}
    />
  );
});

export default ConfirmAddManufacturerNetwork;
