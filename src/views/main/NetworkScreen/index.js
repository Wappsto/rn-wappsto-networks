import React, { useState, useEffect } from 'react';
import { Text as RNText, View, StyleSheet } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import theme from '../../../theme/themeExport';
import Text from '../../../components/Text';
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
  idRow:{
    height: 100,
    width:'100%',
    backgroundColor:'red',
    flexDirection:'row',
  },
  circle: {
    width: 7,
    height: 7,
    borderRadius: 5,
    marginRight: 6
  },
  online: {
    backgroundColor: '#32CD32'
  },
  offline: {
    backgroundColor: '#999'
  },
  label:{
    marginBottom: 20,
    backgroundColor: theme.variables.secondary,
    paddingVertical: 3
  },
  toast: {
    zIndex: 999
  }
});

const NetworkScreen = React.memo(({navigation}) => {
  const { t } = useTranslation();
  const [copiedText, setCopiedText] = useState('Nothing copied yet');
  const [copiedTextVisible, setCopiedTextVisible] = useState(false);
  const network = useGetItemEntity(selectedNetworkName, 'network');
  const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } = useDeleteItem(network);
  const [shareVibile, showShare, hideShare] = useVisible(false);

  useUnmountRemoveItem(selectedNetworkName);
  useUndefinedBack(network, navigation);

  useEffect(() => {
    let t;
    if(copiedTextVisible){
      t = setTimeout(() => {
        setCopiedTextVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(t);
    }
  }, [copiedTextVisible]);

  if(!network || !network.meta || !network.meta.id ){
    return null;
  }
  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    setCopiedText(id);
    setCopiedTextVisible(true);
  }

  return (
    <Screen>
      <Toast ref={Toast.setRef} style={styles.toast} />
      <View style={styles.container}>
        <Share item={network} visible={shareVibile} hide={hideShare}/>
        <View>
          {network.name &&
            <RNText>
              <Text size='p' bold content={CapitalizeFirst(t('networkDescription.name')) + ': '} />
              <Text content={network.name}/>
            </RNText>
          }
          <View style={theme.common.row}>
            <View>
              <Text bold content={CapitalizeFirst(t('networkDescription.uuid')) + ': '}/>
              <Text ellipsizeMode='tail' content={network.meta.id}/>
            </View>
            <Button onPress={() => copyToClipboard(network.meta.id)} type='link' color='primary' icon='clipboard'/>
          </View>
          {copiedTextVisible &&
            <View style={styles.label}>
              <Text align='center' color={theme.variables.textInverse} content={'Copied: ' + copiedText}/>
            </View>
          }
          <RNText>
            <Text bold content={CapitalizeFirst(t('networkDescription.created')) + ': '} />
            <Timestamp timestamp={network.meta.created}/>
          </RNText>
          <RNText>
            <Text bold content={CapitalizeFirst(t('networkDescription.updated')) + ': '}/>
            <Timestamp timestamp={network.meta.updated}/>
          </RNText>
          { !!network.meta.connection &&
            <View style={theme.common.row}>
              <Text bold content={CapitalizeFirst(t('networkDescription.connection')) + ': '}/>
              <View style={[styles.circle, network.meta.connection?.online ? styles.online : styles.offline ]} />
              <RNText>
                <Text content={
                  (network.meta.connection?.online ? CapitalizeFirst(t('networkDescription.online')) : CapitalizeFirst(t('networkDescription.offline'))) + ' '}/>
                <Timestamp timestamp={network.meta.updated}/>
              </RNText>
            </View>
          }
          { !!network.meta.control_timeout &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('networkDescription.control_timeout')) + ': '}/>
              <Text content={network.meta.control_timeout}/>
            </RNText>
          }
          { !!network.meta.control_when_offline &&
            <RNText>
              <Text bold content={CapitalizeFirst(t('networkDescription.control_when_offline')) + ': '}/>
              <Text content={network.meta.control_when_offline}/>
            </RNText>
          }
        </View>
        <View>
          <Button
            display='block'
            disabled={request && request.status === 'pending'}
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
