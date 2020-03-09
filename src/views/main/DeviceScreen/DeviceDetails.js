import React from 'react';
import { Text } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import { selectedDeviceName } from '../../../util/params';
import useGetItemEntity from '../../../hooks/useGetItemEntity';

const ValueSettings = React.memo(() => {
  const { t } = useTranslation();
  const device = useGetItemEntity(selectedDeviceName, 'device');

  const content = (visible, hide) => {
    if(!device || !device.meta || !device.meta.id){
      return null;
    }
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text style={theme.common.H5}>
          {CapitalizeEach(t('deviceInfoHeader'))}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.name'))}: {device.name}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.uuid'))}: {device.meta.id}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.manufacturer'))}:{' '}
          {device.manufacturer}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.product'))}: {device.product}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.version'))}: {device.version}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.serial'))}: {device.serial}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.description'))}:{' '}
          {device.description}
        </Text>
        <Text>
          {CapitalizeFirst(t('deviceDescription.included'))}:{' '}
          {device.included}
        </Text>
      </Popup>
    );
  };

  return <PopupButton icon='info' color={theme.variables.white}>{content}</PopupButton>;
});

export default ValueSettings;
