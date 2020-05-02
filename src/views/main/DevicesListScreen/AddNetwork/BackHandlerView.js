import React from 'react';
import { StatusBar, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../../translations';

const BackHandlerView = React.memo(({ handleBack, hide, children }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={theme.common.container}>
      <View style={[theme.common.row, {justifyContent:'space-between'}]}>
        <Icon name='arrow-left' color={theme.variables.textColor} onPress={handleBack} size={24} style={theme.common.spaceAround}/>
        <Button
          onPress={hide}
          type='link'
          text={CapitalizeFirst(t('cancel'))}
        />
      </View>
      <ScrollView>
        <View style={theme.common.fullScreenModalContent}>
          {children}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default BackHandlerView;
