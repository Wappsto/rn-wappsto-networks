import React, { useMemo } from 'react';
import { Text } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '../../../translations';
import { makeEntitySelector } from 'wappsto-redux/selectors/entities';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { selectedDeviceName } from '../../../util/params';
import { useSelector } from 'react-redux';

const ValueSettings = React.memo(() => {
  const getItem = useMemo(makeItemSelector, []);
  const selectedDevice = useSelector(state => getItem(state, selectedDeviceName));
  const getEntity = useMemo(makeEntitySelector, []);
  const device = useSelector(state => getEntity(state, 'device', selectedDevice));

  const content = (visible, hide) => {
    if(!device || !device.meta || !device.meta.id){
      return null;
    }
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text style={theme.common.H5}>
          {CapitalizeEach(i18n.t('deviceInfoHeader'))}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.name'))}: {device.name}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.uuid'))}: {device.meta.id}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.manufacturer'))}:{' '}
          {device.manufacturer}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.product'))}: {device.product}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.version'))}: {device.version}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.serial'))}: {device.serial}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.description'))}:{' '}
          {device.description}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.included'))}:{' '}
          {device.included}
        </Text>
      </Popup>
    );
  };

  return <PopupButton icon='info' color={theme.variables.white}>{content}</PopupButton>;
});

export default ValueSettings;
