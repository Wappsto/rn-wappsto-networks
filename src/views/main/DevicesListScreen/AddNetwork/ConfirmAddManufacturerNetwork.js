import React from 'react';
import ConfirmationPopup from '../../../../components/ConfirmationPopup';
import { CapitalizeEach, CapitalizeFirst, useTranslation } from '../../../../translations';

const ConfirmAddManufacturerNetwork = React.memo(({ visible, accept, reject }) => {
  const { t } = useTranslation();
  return (
    <ConfirmationPopup
      title={CapitalizeEach(t('onboarding.claimNetwork.addManufacturerNetworkTitle'))}
      description={CapitalizeFirst(t('onboarding.claimNetwork.manufacturerAsOwnerWarning'))}
      visible={visible}
      accept={accept}
      reject={reject}
    />
  );
});

export default ConfirmAddManufacturerNetwork;
