import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Popup from './Popup';
import { useTranslation, CapitalizeFirst } from '../translations';
import theme from '../theme/themeExport';

const ConfirmationPopup = React.memo(({ visible, accept, reject, title, description, acceptStyle, rejectStyle, acceptText }) => {
  const { t } = useTranslation();
  return (
    <Popup visible={visible} onRequestClose={reject} hide={reject} hideCloseIcon={true}>
      <Text style={theme.common.H3}>
        {title}
      </Text>
      <Text style={theme.common.p}>
        {description}
      </Text>
      <View style={theme.common.btnGroup}>
        <TouchableOpacity
          style={[theme.common.button, rejectStyle]}
          onPress={reject}>
          <Text style={theme.common.buttonText}>
            {CapitalizeFirst(t('no'))}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[theme.common.button, theme.common.spaceLeft, acceptStyle]}
          onPress={accept}>
          <Text style={theme.common.buttonText}>
            {acceptText || CapitalizeFirst(t('yes'))}
          </Text>
        </TouchableOpacity>
      </View>
    </Popup>
  );
});

export default ConfirmationPopup;
