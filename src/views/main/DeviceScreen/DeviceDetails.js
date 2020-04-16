import React from 'react';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import { selectedDeviceName } from '../../../util/params';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import RequestError from '../../../components/RequestError';
import useDeleteItem from '../../../hooks/useDeleteItem';
import Icon from 'react-native-vector-icons/Feather';

const ValueSettings = React.memo(() => {
  const { t } = useTranslation();
  const device = useGetItemEntity(selectedDeviceName, 'device');
  const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } = useDeleteItem(device);

  const content = (visible, hide) => {
    if(!device || !device.meta || !device.meta.id){
      return null;
    }
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmationPopup
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
        />
        <Text size='h4' content={device.name}/>
        <Text content={CapitalizeFirst(t('deviceDescription.uuid')) + ': ' + device.meta.id}/>
        <Text content={CapitalizeFirst(t('deviceDescription.manufacturer')) + ': ' + device.manufacturer}/>
        <Text content={CapitalizeFirst(t('deviceDescription.product')) + ': ' + device.product}/>
        <Text content={CapitalizeFirst(t('deviceDescription.version')) + ': ' + device.version}/>
        <Text content={CapitalizeFirst(t('deviceDescription.serial')) + ': ' + device.serial}/>
        <Text content={CapitalizeFirst(t('deviceDescription.description')) + ': ' + device.description}/>
        <Text content={CapitalizeFirst(t('deviceDescription.included')) + ': ' + device.included}/>
        <RequestError request={request} />
        <Button
          type='outlined'
          color='alert'
          onPress={showDeleteConfirmation}
          icon='trash-2'
          request={request}
          text={CapitalizeFirst(t('delete'))}
        />
      </Popup>
    );
  };

  return <PopupButton icon='info' color={theme.variables.white}>{content}</PopupButton>;
});

export default ValueSettings;
