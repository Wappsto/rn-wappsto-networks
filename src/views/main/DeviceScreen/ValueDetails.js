import React, { useCallback } from 'react';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import Text from '../../../components/Text';
import { useTranslation, CapitalizeFirst } from '../../../translations';

const exist = (num) => num !== undefined && num !== null && !isNaN(num);

const  getValueType = (value, t) => {
  if (value) {
    if (value.hasOwnProperty('blob')) {
      return {
        view: (
          <>
            {!!value.blob.encoding &&
              <Text content={CapitalizeFirst(t('valueDescription.encoding')) + ': ' + value.blob.encoding}/>
            }
            {!!value.blob.max &&
              <Text content={CapitalizeFirst(t('valueDescription.maxLength')) + ': ' + value.blob.max}/>
            }
          </>
        ),
        text: 'blob',
      };
    } else if (value.hasOwnProperty('number')) {
      return {
        view: (
          <>
            {exist(value.number.min) &&
              <Text content={CapitalizeFirst(t('valueDescription.min')) + ': ' + value.number.min} />
            }
            {exist(value.number.max) &&
              <Text content={CapitalizeFirst(t('valueDescription.max')) + ': ' + value.number.max} />
            }
            {exist(value.number.step) &&
              <Text content={CapitalizeFirst(t('valueDescription.stepSize')) + ': ' + value.number.step} />
            }
            {!!value.number.unit &&
              <Text content={CapitalizeFirst(t('valueDescription.unit')) + ': ' + value.number.unit} />
            }
          </>
        ),
        text: 'number',
      };
    } else if (value.hasOwnProperty('string')) {
      return {
        view: (
          <>
          {!!value.string.encoding &&
            <Text content={CapitalizeFirst(t('valueDescription.encoding')) + ': ' + value.string.encoding}/>
          }
          {!!value.string.max &&
            <Text content={CapitalizeFirst(t('valueDescription.maxLength')) + ': ' + value.string.max}/>
          }
          </>
        ),
        text: 'string',
      };
    } else if (value.hasOwnProperty('xml')) {
      return {
        view: (
          <>
            {!!value.xml.xsd &&
              <Text content={CapitalizeFirst(t('valueDescription.xsd')) + ': ' + value.xml.xsd}/>
            }
            {!!value.xml.namespace &&
              <Text content={CapitalizeFirst(t('valueDescription.namespace')) + ': ' + value.xml.namespace}/>
            }
          </>
        ),
        text: 'xml',
      };
    }
  }
  return {view: null, text: ''};
}

const ValueSettings = React.memo(({ item }) => {
  const { t } = useTranslation();
  const content = useCallback((visible, hide) => {
    const valueDataType = getValueType(item, t);
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text size={'h4'} content={item.name}/>
        <Text content={CapitalizeFirst(t('valueDescription.uuid')) + ': ' + item.meta.id}/>
        {!!item.type &&
          <Text content={CapitalizeFirst(t('valueDescription.type')) + ': ' + item.type}/>
        }
        {!!item.permission &&
          <Text content={CapitalizeFirst(t('valueDescription.permission')) + ': ' + item.permission}/>
        }
        {!!item.status &&
          <Text content={CapitalizeFirst(t('valueDescription.status')) + ': ' + item.status}/>
        }
        {!!valueDataType.text &&
          <Text content={CapitalizeFirst(t('valueDescription.dataType')) + ': ' + valueDataType.text}/>
        }
        {valueDataType.view}
      </Popup>
    );
  }, [item, t]);
  return <PopupButton icon='info'>{content}</PopupButton>;
});

export default ValueSettings;
