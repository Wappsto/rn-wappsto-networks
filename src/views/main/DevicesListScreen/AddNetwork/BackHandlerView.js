import React from 'react';
import { StatusBar, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../../../theme/themeExport';
import i18n, { CapitalizeFirst } from '../../../../translations';

const BackHandlerView = React.memo(({ handleBack, hide, children }) => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.variables.white}}>
      <StatusBar backgroundColor={theme.variables.white} barStyle='dark-content' />
      <Icon name='arrow-left' onPress={handleBack} size={24} style={theme.common.spaceAround}/>
      <ScrollView>
        <View style={theme.common.fullScreenModalContent}>
          {children}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={theme.common.spaceAround}
        onPress={hide}>
        <Text style={theme.common.linkBtn}>
          {CapitalizeFirst(i18n.t('cancel'))}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
});

export default BackHandlerView;
