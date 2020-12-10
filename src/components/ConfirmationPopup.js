import React from 'react';
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Text from '../components/Text';
import Button from '../components/Button';
import Popup from './Popup';
import { useTranslation, CapitalizeFirst } from '../translations';

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40
  }
});

const ConfirmationPopup = React.memo(({ visible, accept, reject, title, description, rejectText, acceptText, acceptDisabled, children }) => {
  const { t } = useTranslation();

  return (
    <Popup visible={visible} onRequestClose={reject} hide={reject} hideCloseIcon={true}>
      <View>
        <Text
          size={16}
          bold
          content={title ? title : CapitalizeFirst(t('deleteConfirmationQuestion'))}
        />
        <Text
          size='p'
          color='secondary'
          content={description ? description : CapitalizeFirst(t('deleteConfirmationDescription'))}
        />
        <KeyboardAvoidingView>
          {children}
        </KeyboardAvoidingView>
        <View style={styles.btnGroup}>
          <Button
            type='link'
            onPress={reject}
            align='left'
            text={rejectText || CapitalizeFirst(t('genericButton.no'))}
          />
          <Button
            type='link'
            onPress={accept}
            color='alert'
            disabled={acceptDisabled}
            text={acceptText || CapitalizeFirst(t('genericButton.yes'))}
          />
        </View>
      </View>
    </Popup>
  );
});

export default ConfirmationPopup;
