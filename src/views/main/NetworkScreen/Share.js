import React, { useState } from 'react';
import { View } from 'react-native';
import Popup from '../../../components/Popup';
import Input, { styles } from '../../../components/Input';
import CheckBox from '../../../components/CheckBox';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import RequestError from '../../../components/RequestError';
import { useRequest } from 'wappsto-blanket';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../translations';
import { isEmail } from '../../../util/helpers';
import { isUUID } from 'wappsto-redux';
import { getRequestErrorMessage } from '../../../util/helpers';
import Toast from 'react-native-toast-message';

const DEFAULT_RESTRICTION = { retrieve: true, update: true };
const Share = React.memo(({ item, visible, hide }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState('');
  const [restriction, setRestriction] = useState(DEFAULT_RESTRICTION);
  const [error, setError] = useState({});
  const { send, request } = useRequest('share_' + item.meta.id);
  const loading = request?.status === 'pending';
  const canShare = !loading && user.length;

  const share = () => {
    if (request?.status === 'pending') {
      return;
    }
    let validationError = false;
    let newError = {};
    if (!isUUID(user) && !isEmail(user)) {
      validationError = true;
      newError = { ...newError, user: true };
    }
    let allFalse = true;
    for (let key in restriction) {
      if (restriction[key]) {
        allFalse = false;
      }
    }
    if (allFalse) {
      validationError = true;
      newError = { ...newError, restriction: true };
    }
    setError(newError);
    if (validationError) {
      return;
    }
    const promise = send({
      url: `/acl/${item.meta.id}?propagate=true`,
      method: 'PATCH',
      body: {
        permission: [
          {
            meta: {
              id: user.toLowerCase(),
            },
            restriction: [{ method: restriction }],
          },
        ],
      },
    });
    promise
      .then(response => {
        if (response.ok) {
          Toast.show({
            type: 'success',
            text1: CapitalizeFirst(
              t('acl:shareItem.success', {
                name: item.name || item.meta.id,
                user,
              }),
            ),
          });
          setUser('');
          setRestriction(DEFAULT_RESTRICTION);
          setError({});
          hide();
        } else if (!visible) {
          Toast.show({
            type: 'error',
            text1: CapitalizeFirst(
              t('acl:shareItem.error', { name: item.name || item.meta.id, user }),
            ),
            text2: getRequestErrorMessage(response, t),
          });
        }
      })
      .catch(response => {
        if (!visible) {
          Toast.show({
            type: 'error',
            text1: CapitalizeFirst(
              t('acl:shareItem.error', { name: item.name || item.meta.id, user }),
            ),
            text2: getRequestErrorMessage(response, t),
          });
        }
      });
  };

  return (
    <Popup visible={visible} hide={hide} onRequestClose={hide} fullScreen={false}>
      <Input
        disabled={loading}
        label={CapitalizeFirst(t('acl:enterUserEmailOrId'))}
        validationError={
          error.user && CapitalizeFirst(t('acl:validation.valueDoesntMatchIdOrEmail'))
        }
        value={user}
        onChangeText={setUser}
      />
      <CheckBox
        disabled={loading}
        checked={restriction.create}
        text={CapitalizeFirst(t('acl:method.create'))}
        onPress={() => setRestriction(r => ({ ...r, create: !r.create }))}
      />
      <CheckBox
        disabled={loading}
        checked={restriction.retrieve}
        text={CapitalizeFirst(t('acl:method.retrieve'))}
        onPress={() => setRestriction(r => ({ ...r, retrieve: !r.retrieve }))}
      />
      <CheckBox
        disabled={loading}
        checked={restriction.update}
        text={CapitalizeFirst(t('acl:method.update'))}
        onPress={() => setRestriction(r => ({ ...r, update: !r.update }))}
      />
      <CheckBox
        disabled={loading}
        checked={restriction.delete}
        text={CapitalizeFirst(t('acl:method.delete'))}
        onPress={() => setRestriction(r => ({ ...r, delete: !r.delete }))}
      />
      {!!error.restriction && (
        <Text
          color="error"
          content={CapitalizeFirst(t('acl:validation.atLeastOneNeedstoBeSelected'))}
          style={styles.validationError}
        />
      )}
      <RequestError request={request} />
      <View>
        {/*
          <Button
            disabled={!canShare}
            style={!canShare && theme.common.disabled}
            onPress={hide}
            display='block'
            color='primary'
            text={CapitalizeFirst(t('cancel'))}
          />
          */}
        <Button
          request={request}
          disabled={!canShare}
          style={!canShare && theme.common.disabled}
          onPress={share}
          display="block"
          color="primary"
          text={CapitalizeFirst(t('acl:share'))}
        />
      </View>
    </Popup>
  );
});

export default Share;
