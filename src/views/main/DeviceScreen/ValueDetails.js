import React, { useCallback } from 'react';
import { Text as RNText, View, StyleSheet } from 'react-native';
import PopupButton from '../../../components/PopupButton';
import Popup from '../../../components/Popup';
import ID from '../../../components/ID';
import Text from '../../../components/Text';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import useEntitiesSelector from 'wappsto-blanket/hooks/useEntitiesSelector';
import theme from '../../../theme/themeExport';

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 8,
    borderRadius: theme.variables.borderRadiusBase,
    borderColor: theme.variables.borderColor,
    borderWidth: theme.variables.borderWidth,
  }
});

const exist = (num) => num !== undefined && num !== null && !isNaN(num);

const  getValueType = (value, t) => {
  if (value) {
    if (value.hasOwnProperty('blob')) {
      return {
        view: (
          <>
            {!!value.blob.encoding &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.blobProperties.encoding')) + ': '}/>
                <Text content={value.blob.encoding}/>
              </RNText>
            }
            {!!value.blob.max &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.blobProperties.maxLength')) + ': '}/>
                <Text content={value.blob.max}/>
              </RNText>
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
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.numberProperties.min')) + ': '}/>
                <Text content={value.number.min} />
              </RNText>
            }
            {exist(value.number.max) &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.numberProperties.max')) + ': '}/>
                <Text content={value.number.max} />
              </RNText>
            }
            {exist(value.number.step) &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.numberProperties.step')) + ': '}/>
                <Text content={value.number.step} />
              </RNText>
            }
            {!!value.number.unit &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.numberProperties.unit')) + ': '}/>
                <Text content={value.number.unit} />
              </RNText>
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
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.stringProperties.encoding')) + ': '}/>
              <Text content={value.string.encoding}/>
            </RNText>
          }
          {!!value.string.max &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.stringProperties.max')) + ': '}/>
              <Text content={value.string.max}/>
            </RNText>
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
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.xmlProperties.xsd')) + ': '}/>
                <Text content={value.xml.xsd}/>
              </RNText>
            }
            {!!value.xml.namespace &&
              <RNText>
                <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.xmlProperties.namespace')) + ': '}/>
                <Text content={value.xml.namespace}/>
              </RNText>
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
  const states = useEntitiesSelector('state', { parent: { type: 'value', id: item.meta.id }});
  const valueDataType = getValueType(item, t);
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <Text size={'h4'} content={item.name}/>
        <ID id={item.meta.id} label={CapitalizeFirst(t('dataModel:valueProperties.meta.id'))}/>
        {!!item.type &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.type')) + ': '}/>
            <Text content={item.type}/>
          </RNText>
        }
        {!!item.permission &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.permission')) + ': '}/>
            <Text content={item.permission}/>
          </RNText>
        }
        {!!item.status &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.status')) + ': '}/>
            <Text content={item.status}/>
          </RNText>
        }
        {!!item.period &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.period')) + ': '}/>
            <Text content={item.period}/>
          </RNText>
        }
        {!!item.delta &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.delta')) + ': '}/>
            <Text content={item.delta}/>
          </RNText>
        }
        {!!item.description &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.description')) + ': '}/>
            <Text content={item.description}/>
          </RNText>
        }
        {!!valueDataType.text &&
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:valueProperties.dataType')) + ': '}/>
            <Text content={valueDataType.text}/>
          </RNText>
        }
        {valueDataType.view}
        {states.length && states.map(state => (
          <View style={styles.container} key={state.meta.id}>
            <Text size={16} content={CapitalizeFirst(t('dataModel:stateProperties.' + (state.type === 'Report' ? 'reportState' : 'controlState'))) }/>
            <ID id={state.meta.id} label={CapitalizeFirst(t('dataModel:stateProperties.meta.id'))}/>
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.historical'))+ ': '}/>
              <Text content={state.meta.historical ? CapitalizeFirst(t('dataModel:universalMeta.historicalOptions.' + state.meta.historical)) : CapitalizeFirst(t('dataModel:universalMeta.historicalOptions.true'))}/>
            </RNText>
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:stateProperties.data')) + ': '}/>
              <Text content={state.data || '-'}/>
            </RNText>
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:stateProperties.timestamp')) + ': '}/>
              <Text content={state.timestamp}/>
            </RNText>
          </View>
        ))
        }
      </Popup>
    );
  }, [item, t]);
  return <PopupButton icon='info'>{content}</PopupButton>;
});

export default ValueSettings;
