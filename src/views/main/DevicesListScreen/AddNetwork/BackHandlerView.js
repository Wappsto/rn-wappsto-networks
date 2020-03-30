import React from 'react';
import { StatusBar, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../../translations';

const BackHandlerView = React.memo(({ handleBack, hide, children }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.variables.lightGray}}>
      <StatusBar backgroundColor={theme.variables.lightGray} barStyle='dark-content' />
      <View style={[theme.common.row, {justifyContent:'space-between'}]}>
        <Icon name='arrow-left' onPress={handleBack} size={24} style={theme.common.spaceAround}/>
        <TouchableOpacity onPress={hide}>
          <Text style={theme.common.linkBtn}>
            {CapitalizeFirst(t('cancel'))}
          </Text>
        </TouchableOpacity>
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
