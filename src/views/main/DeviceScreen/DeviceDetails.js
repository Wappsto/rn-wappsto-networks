import React from 'react';
import { Text as RNText } from 'react-native';
import Button from '../../../components/Button';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import ID from '../../../components/ID';
import Popup from '../../../components/Popup';
import PopupButton from '../../../components/PopupButton';
import RequestError from '../../../components/RequestError';
import Text from '../../../components/Text';
import useDeleteItem from '../../../hooks/useDeleteItem';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import theme from '../../../theme/themeExport';
import { CapitalizeFirst, useTranslation } from '../../../translations';
import { selectedDeviceName } from '../../../util/params';

const ValueSettings = React.memo(() => {
  const { t } = useTranslation();
  const device = useGetItemEntity(selectedDeviceName, 'device');
  const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } =
    useDeleteItem(device);

  const content = (visible, hide) => {
    if (!device || !device.meta || !device.meta.id) {
      return null;
    }
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmationPopup
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
        />
        <Text
          size="h4"
          content={
            device.meta.name_by_user !== device.name
              ? `${device.meta.name_by_user} (${device.name})`
              : device.name
          }
        />
        <ID id={device.meta.id} label={CapitalizeFirst(t('dataModel:deviceProperties.meta.id'))} />
        {!!device.manufacturer && (
          <RNText>
            <Text
              bold
              content={CapitalizeFirst(t('dataModel:deviceProperties.manufacturer')) + ': '}
            />
            <Text content={device.manufacturer} />
          </RNText>
        )}
        {!!device.product && (
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:deviceProperties.product')) + ': '} />
            <Text content={device.product} />
          </RNText>
        )}
        {!!device.version && (
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:deviceProperties.version')) + ': '} />
            <Text content={device.version} />
          </RNText>
        )}
        {!!device.serial && (
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:deviceProperties.serial')) + ': '} />
            <Text content={device.serial} />
          </RNText>
        )}
        {!!device.protocol && (
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:deviceProperties.protocol')) + ': '} />
            <Text content={device.protocol} />
          </RNText>
        )}
        {!!device.communication && (
          <RNText>
            <Text
              bold
              content={CapitalizeFirst(t('dataModel:deviceProperties.communication')) + ': '}
            />
            <Text content={device.communication} />
          </RNText>
        )}
        {!!device.description && (
          <RNText>
            <Text
              bold
              content={CapitalizeFirst(t('dataModel:deviceProperties.description')) + ': '}
            />
            <Text content={device.description} />
          </RNText>
        )}
        {!!device.included && (
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:deviceProperties.included')) + ': '} />
            <Text content={device.included} />
          </RNText>
        )}
        {!!device.control_timeout && (
          <RNText>
            <Text
              bold
              content={CapitalizeFirst(t('dataModel:deviceProperties.control_timeout')) + ': '}
            />
            <Text content={device.control_timeout + 's'} />
          </RNText>
        )}
        {!!device.control_when_offline && (
          <RNText>
            <Text
              bold
              content={CapitalizeFirst(t('dataModel:deviceProperties.control_when_offline')) + ': '}
            />
            <Text content={t('dataModel:' + device.control_when_offline)} />
          </RNText>
        )}
        <RequestError request={request} />
        <Button
          type="outlined"
          color="alert"
          onPress={showDeleteConfirmation}
          icon="trash-2"
          request={request}
          disabled={request && request.status === 'pending'}
          text={CapitalizeFirst(t('genericButton.delete'))}
        />
      </Popup>
    );
  };

  return (
    <PopupButton icon="info" color={theme.variables.white}>
      {content}
    </PopupButton>
  );
});

export default ValueSettings;
