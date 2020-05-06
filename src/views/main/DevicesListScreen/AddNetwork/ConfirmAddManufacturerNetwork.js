import React from 'react';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../../translations';
import ConfirmationPopup from '../../../../components/ConfirmationPopup';

const ConfirmAddManufacturerNetwork = React.memo(({ visible, accept, reject }) => {
  const { t } = useTranslation();
  return (
    <ConfirmationPopup
      title={CapitalizeEach(t('onboarding.claiming.addManufacturerNetworkTitle'))}
      description={CapitalizeFirst(t('onboarding.claiming.manufacturerAsOwnerWarning'))}
      visible={visible}
      accept={accept}
      reject={reject}
    />
  );
});

export default ConfirmAddManufacturerNetwork;
