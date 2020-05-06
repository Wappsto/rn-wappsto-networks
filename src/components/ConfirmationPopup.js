import React from 'react';
import { View, StyleSheet } from 'react-native';
import Text from '../components/Text';
import Button from '../components/Button';
import Popup from './Popup';
import { useTranslation, CapitalizeFirst } from '../translations';

const styles = StyleSheet.create({
  btnGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

const ConfirmationPopup = React.memo(({ visible, accept, reject, title, description, acceptText }) => {
  const { t } = useTranslation();

  return (
    <Popup visible={visible} onRequestClose={reject} hide={reject} hideCloseIcon={true}>
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
      <View style={styles.btnGroup}>
        <Button
          type='link'
          onPress={reject}
          align='left'
          text={CapitalizeFirst(t('no'))}
        />
        <Button
          type='link'
          onPress={accept}
          color='alert'
          text={acceptText || CapitalizeFirst(t('yes'))}
        />
      </View>
    </Popup>
  );
});

export default ConfirmationPopup;
