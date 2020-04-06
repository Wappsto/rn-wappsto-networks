import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import { selectedDeviceName } from '../../../util/params';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import ItemDeleteIndicator from '../../../components/ItemDeleteIndicator';
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
          title={CapitalizeEach(t('deleteDevice.title'))}
          description={CapitalizeFirst(t('deleteDevice.description'))}
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
          acceptStyle={theme.common.errorPanel} />
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
        <TouchableOpacity onPress={showDeleteConfirmation} style={[theme.common.button, theme.common.errorPanel]}>
          <ItemDeleteIndicator request={request} />
          <Text style={theme.common.buttonText}>
            <Icon name='trash-2' size={20} />
            {CapitalizeFirst(t('delete'))}
          </Text>
        </TouchableOpacity>
      </Popup>
    );
  };

  return <PopupButton icon='info' color={theme.variables.white}>{content}</PopupButton>;
});

export default ValueSettings;
