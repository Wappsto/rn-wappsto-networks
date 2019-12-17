import React, { useCallback } from 'react';
import { Text } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import i18n, { CapitalizeFirst, CapitalizeEach } from '../../../translations';

const ValueSettings = React.memo(({ item }) => {

  const content = useCallback((visible, hide) => {
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text style={theme.common.H5}>
          {CapitalizeEach(i18n.t('deviceInfoHeader'))}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.name'))}: {item.name}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.uuid'))}: {item.meta.id}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.manufacturer'))}:{' '}
          {item.manufacturer}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.product'))}: {item.product}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.version'))}: {item.version}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.serial'))}: {item.serial}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.description'))}:{' '}
          {item.description}
        </Text>
        <Text>
          {CapitalizeFirst(i18n.t('deviceDescription.included'))}:{' '}
          {item.included}
        </Text>
      </Popup>
    );
  }, [item]);

  return <PopupButton icon='settings'>{content}</PopupButton>;
});

export default ValueSettings;
