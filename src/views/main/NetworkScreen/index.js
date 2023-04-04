import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Text as RNText, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { useVisible } from 'wappsto-blanket';
import Button from '../../../components/Button';
import ConfirmationPopup from '../../../components/ConfirmationPopup';
import ID from '../../../components/ID';
import RequestError from '../../../components/RequestError';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Timestamp from '../../../components/Timestamp';
import useDeleteItem from '../../../hooks/useDeleteItem';
import useGetItemEntity from '../../../hooks/useGetItemEntity';
import useUndefinedBack from '../../../hooks/useUndefinedBack';
import useUnmountRemoveItem from '../../../hooks/useUnmountRemoveItem';
import { CapitalizeFirst, useTranslation } from '../../../translations';
import { selectedNetworkName } from '../../../util/params';
import Share from './Share';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  toast: {
    zIndex: 999,
  },
});

const NetworkScreen = React.memo(() => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const network = useGetItemEntity(selectedNetworkName, 'network');
  const { deleteItem, request, confirmVisible, showDeleteConfirmation, hideDeleteConfirmation } =
    useDeleteItem(network);
  const [shareVibile, showShare, hideShare] = useVisible(false);

  useUnmountRemoveItem(selectedNetworkName);
  useUndefinedBack(network, navigation);

  useEffect(() => {
    if (network?.meta?.name_by_user) {
      navigation.setOptions({
        title: network.meta.name_by_user,
      });
    }
  }, [network?.meta.name_by_user, navigation]);

  if (!network || !network.meta || !network.meta.id) {
    return null;
  }

  return (
    <Screen>
      <Toast ref={Toast.setRef} style={styles.toast} />
      <View style={styles.container}>
        <Share item={network} visible={shareVibile} hide={hideShare} />
        <View>
          {network.name && (
            <RNText>
              <Text
                size="p"
                bold
                content={CapitalizeFirst(t('dataModel:networkProperties.name')) + ': '}
              />
              <Text
                content={
                  network.meta.name_by_user !== network.name
                    ? `${network.meta.name_by_user} (${network.name})`
                    : network.name
                }
              />
            </RNText>
          )}
          <ID
            id={network.meta.id}
            label={CapitalizeFirst(t('dataModel:networkProperties.meta.id'))}
          />
          {!!network.meta.product && (
            <RNText>
              <Text
                bold
                content={CapitalizeFirst(t('dataModel:networkProperties.meta.product')) + ': '}
              />
              <Text content={network.meta.product} />
            </RNText>
          )}
          {!!network.meta.created && (
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.created')) + ': '} />
              <Text content={network.meta.created + ' '} />
              <Timestamp timestamp={network.meta.created} />
            </RNText>
          )}
          {!!network.meta.updated && (
            <RNText>
              <Text bold content={CapitalizeFirst(t('dataModel:universalMeta.updated')) + ': '} />
              <Text content={network.meta.updated + ' '} />
              <Timestamp timestamp={network.meta.updated} />
            </RNText>
          )}
          {!!network.meta.connection && (
            <RNText>
              <Text
                bold
                content={CapitalizeFirst(t('dataModel:networkProperties.meta.connection')) + ': '}
              />
              <Text
                content={
                  CapitalizeFirst(
                    t(
                      'dataModel:networkProperties.meta.connectionOnline.' +
                        network.meta.connection.online,
                    ),
                  ) +
                  ' ' +
                  t('since') +
                  ' ' +
                  network.meta.connection.timestamp +
                  ' '
                }
              />
              <Timestamp timestamp={network.meta.updated} />
            </RNText>
          )}
          {!!network.meta.control_timeout && (
            <RNText>
              <Text
                bold
                content={CapitalizeFirst(t('dataModel:networkProperties.control_timeout')) + ': '}
              />
              <Text content={network.meta.control_timeout} />
            </RNText>
          )}
          {!!network.meta.control_when_offline && (
            <RNText>
              <Text
                bold
                content={
                  CapitalizeFirst(t('dataModel:networkProperties.control_when_offline')) + ': '
                }
              />
              <Text content={network.meta.control_when_offline} />
            </RNText>
          )}
        </View>
        <View>
          <Button
            display="block"
            disabled={true} //{request && request.status === 'pending'}
            text={CapitalizeFirst(t('acl:share'))}
            onPress={showShare}
            icon="share-2"
          />
          <Button
            type="outlined"
            display="block"
            disabled={true}
            text={CapitalizeFirst(t('configure'))}
            icon="sliders"
          />
          <Button
            type="outlined"
            color="alert"
            display="block"
            onPress={showDeleteConfirmation}
            request={request}
            disabled={request && request.status === 'pending'}
            text={CapitalizeFirst(t('genericButton.delete'))}
            icon="trash-2"
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
  );
});

NetworkScreen.displayName = 'NetworkScreen';
export default NetworkScreen;
