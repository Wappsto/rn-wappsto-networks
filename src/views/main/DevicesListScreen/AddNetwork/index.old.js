import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import PopupButton from '@/components/PopupButton';
import Popup from '@/components/Popup';
import { Modal, View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView} from 'react-native-safe-area-context';
import AddNetworkPopup from './AddNetworkPopup';
import ConfirmAddManufacturerNetwork from './ConfirmAddManufacturerNetwork';
import theme from '@/theme/themeExport';
import useRequest from 'wappsto-blanket/hooks/useRequest';
import { makeItemSelector } from 'wappsto-redux/selectors/items';
import { manufacturerAsOwnerErrorCode, iotNetworkListAdd } from '@/util/params';
import i18n, { CapitalizeFirst } from '@/translations';

const Content = React.memo(({ visible, hide, show }) => {
  const { request, send } = useRequest();
  const [ networkId, setNetworkId ] = useState();
  const [ manufacturerAsOwnerError, setManufacturerAsOwnerError ] = useState(false);
  const getItem = useMemo(makeItemSelector, []);
  const addToList = useSelector(state => getItem(state, iotNetworkListAdd));

  const sendRequest = useCallback((id, body = {}) => {
    setNetworkId(id);
    send({
      method: 'POST',
      url: '/network/' + id,
      query: {
        verbose: true
      },
      body
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptManufacturerAsOwner = useCallback(() => {
    send({
      method: 'POST',
      url: '/network/' + networkId,
      query: {
        verbose: true
      },
      body: {
        meta: {
          accept_manufacturer_as_owner: true
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkId]);

  useEffect(() => {
    if(request){
      if(request.status === 'error' && request.json.code === manufacturerAsOwnerErrorCode){
        hide();
        setManufacturerAsOwnerError(true);
      } else if(request.status === 'success'){
        hide();
        setManufacturerAsOwnerError(false);
        addToList(request.json && request.json.meta.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request]);

  useEffect(() => {
    if(manufacturerAsOwnerError){
      show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manufacturerAsOwnerError]);

  if (manufacturerAsOwnerError) {
    return (
      <Popup visible={visible} onRequestClose={hide} hide={hide}>
        <ConfirmAddManufacturerNetwork
          acceptManufacturerAsOwner={acceptManufacturerAsOwner}
          postRequest={request}
          networkId={networkId}
        />
      </Popup>
    );
  }
  return (
    <Modal
      transparent={true}
      visible={visible}
      hide={hide}
      onRequestClose={hide}>
        <SafeAreaView style={{flex: 1, backgroundColor: theme.variables.white}}>
          <StatusBar backgroundColor={theme.variables.white} barStyle='dark-content' />
          <ScrollView style={{flex:1}}>
            <AddNetworkPopup
              sendRequest={sendRequest}
              postRequest={request}
            />
          </ScrollView>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={hide}  style={{flex: 1}}>
              <Text style={theme.common.linkBtn}>
                {CapitalizeFirst(i18n.t('cancel'))}
              </Text>
            </TouchableOpacity>
            <View style={{flex: 2}}></View>
          </View>
        </SafeAreaView>
    </Modal>
  );
});

const AddNetworkButton = React.memo(() => {
  return (
    <PopupButton icon='plus-circle' color={theme.variables.white}>
      {(visible, hide, show) => <Content visible={visible} hide={hide} show={show} />}
    </PopupButton>
  );
});

export default AddNetworkButton;
