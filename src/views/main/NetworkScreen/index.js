import React from 'react';
import { Text as RNText, View, StyleSheet } from 'react-native';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import theme from '../../../theme/themeExport';
import Text from '../../../components/Text';
import ID from '../../../components/ID';
import Button from '../../../components/Button';
import Screen from '../../../components/Screen';
import Timestamp from '../../../components/Timestamp';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import RequestError from '../../../components/RequestError';
import Share from './Share';
import useDeleteItem from '../../../hooks/useDeleteItem';
import { selectedNetworkName } from '../../../util/params';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import useUnmountRemoveItem from '../../../hooks/useUnmountRemoveItem';
import useUndefinedBack from '../../../hooks/useUndefinedBack';
import useVisible from 'wappsto-blanket/hooks/useVisible';
import Toast from 'react-native-toast-message';

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding: 20,
    justifyContent:'space-between'
  },
  toast: {
    zIndex: 999
  }
});

const NetworkScreen = React.memo(({navigation}) => {
  const { t } = useTranslation();
  const network = useGetItemEntity(selectedNetworkName, 'network');
  const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } = useDeleteItem(network);
  const [shareVibile, showShare, hideShare] = useVisible(false);

  useUnmountRemoveItem(selectedNetworkName);
  useUndefinedBack(network, navigation);

  if(!network || !network.meta || !network.meta.id ){
    return null;
  }

  return (
    <Screen>
      <Toast ref={Toast.setRef} style={styles.toast} />
      <View style={styles.container}>
        <Share item={network} visible={shareVibile} hide={hideShare}/>
        <View>
          {network.name &&
            <RNText>
              <Text size='p' bold content={CapitalizeFirst(t('dataModel:networkProperties.name')) + ': '} />
              <Text content={network.name}/>
            </RNText>
          }
          <ID id={network.meta.id} label={CapitalizeFirst(t('dataModel:networkProperties.meta.id'))}/>
          { !!network.meta.product &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:networkProperties.meta.product')) + ': '}/>
              <Text content={network.meta.product}/>
            </RNText>
          }
          { !!network.meta.created &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.created')) + ': '}/>
              <Text content={network.meta.created + ' '} />
              <Timestamp timestamp={network.meta.created}/>
            </RNText>
          }
          { !!network.meta.updated &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.updated')) + ': '}/>
              <Text content={network.meta.updated + ' '}/>
              <Timestamp timestamp={network.meta.updated}/>
            </RNText>
          }
          { !!network.meta.connection &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:networkProperties.meta.connection')) + ': '}/>
              <Text content={CapitalizeFirst(t('dataModel:networkProperties.meta.connectionOnline.' + network.meta.connection.online))  + ' ' + t('since') + ' ' + network.meta.connection.timestamp + ' '}
              />
              <Timestamp timestamp={network.meta.updated}/>
            </RNText>
          }
          { !!network.meta.control_timeout &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:networkProperties.control_timeout')) + ': '}/>
              <Text content={network.meta.control_timeout}/>
            </RNText>
          }
          { !!network.meta.control_when_offline &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:networkProperties.control_when_offline')) + ': '}/>
              <Text content={network.meta.control_when_offline}/>
            </RNText>
          }
          <RNText>
            <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.historical'))+ ': '}/>
            <Text content={network.meta.historical ? CapitalizeFirst(t('dataModel:universalMeta.historicalOptions.' + device.meta.historical)) : CapitalizeFirst(t('dataModel:universalMeta.historicalOptions.true'))}/>
          </RNText>
        </View>
        <View>
          <Button
            display='block'
            disabled={true} //{request && request.status === 'pending'}
            text={CapitalizeFirst(t('genericButton.share'))}
            onPress={showShare}
            icon='share-2'
          />
          <Button
            type='outlined'
            display='block'
            disabled={true}
            text={CapitalizeFirst(t('configure'))}
            icon='sliders'
          />
          <Button
            type='outlined'
            color='alert'
            display='block'
            onPress={showDeleteConfirmation}
            request={request}
            disabled={request && request.status === 'pending'}
            text={CapitalizeFirst(t('genericButton.delete'))}
            icon='trash-2'
          />

          <RequestError request={request} />
        </View>
        <ConfirmationPopup
          visible={confirmVisible}
          accept={deleteItem}
          reject={hideDeleteConfirmation}
        />
      </View>
    </Screen>
  )
});

NetworkScreen.navigationOptions = ({ navigation, route }) => {
    return {
      ...theme.headerStyle,
      title: route.params.title || ''
    };
  };
export default NetworkScreen;
