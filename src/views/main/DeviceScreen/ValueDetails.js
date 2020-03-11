import React, { useCallback } from 'react';
import { View, Text } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';

const  getValueType = (value, t) => {
  if (value) {
    if (value.hasOwnProperty('blob')) {
      return {
        view: (
          <View>
            <Text>
              {CapitalizeFirst(t('valueDescription.encoding'))}:{' '}
              {value.blob.encoding}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.maxLength'))}:{' '}
              {value.blob.max}
            </Text>
          </View>
        ),
        text: 'blob',
      };
    } else if (value.hasOwnProperty('number')) {
      return {
        view: (
          <View>
            <Text>
              {CapitalizeFirst(t('valueDescription.min'))}:{' '}
              {value.number.min}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.max'))}:{' '}
              {value.number.max}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.stepSize'))}:{' '}
              {value.number.step}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.unit'))}:{' '}
              {value.number.unit}
            </Text>
          </View>
        ),
        text: 'number',
      };
    } else if (value.hasOwnProperty('string')) {
      return {
        view: (
          <View>
            <Text>
              {CapitalizeFirst(t('valueDescription.encoding'))}:{' '}
              {value.string.encoding}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.maxLength'))}:{' '}
              {value.string.max}
            </Text>
          </View>
        ),
        text: 'string',
      };
    } else if (value.hasOwnProperty('xml')) {
      return {
        view: (
          <View>
            <Text>
              {CapitalizeFirst(t('valueDescription.xsd'))}:{' '}
              {value.xml.xsd}
            </Text>
            <Text>
              {CapitalizeFirst(t('valueDescription.namespace'))}:{' '}
              {value.xml.namespace}
            </Text>
          </View>
        ),
        text: 'xml',
      };
    }
  }
  return {view: null, text: ''};
}

const ValueSettings = React.memo(({ item }) => {
  const content = useCallback((visible, hide) => {
    const { t } = useTranslation();
    const valueDataType = getValueType(item, t);
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text style={theme.common.H5}>
          {CapitalizeEach(t('valueInfoHeader'))}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.name'))}: {item.name}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.uuid'))}: {item.meta.id}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.type'))}: {item.type}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.permission'))}:{' '}
          {item.permission}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.status'))}: {item.status}
        </Text>
        <Text>
          {CapitalizeFirst(t('valueDescription.dataType'))}:{' '}
          {valueDataType.text}
        </Text>
        {valueDataType.view}
      </Popup>
    );
  }, [item]);
  return <PopupButton icon='info'>{content}</PopupButton>;
});

export default ValueSettings;
