import React from 'react';
<<<<<<< HEAD
import { ScrollView, View, StyleSheet } from 'react-native';
=======
import { ScrollView, View } from 'react-native';
>>>>>>> get-wifi-list-from-device
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../../../components/Button';
import Icon from 'react-native-vector-icons/Feather';
import theme from '../../../../theme/themeExport';
import { useTranslation, CapitalizeFirst } from '../../../../translations';

const styles = StyleSheet.create({
  header:{
    justifyContent:'space-between',
    flexDirection: 'row',
    alignItems: 'center'
  }
});

const BackHandlerView = React.memo(({ handleBack, hide, children }) => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={theme.common.container}>
      <View style={styles.header}>
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
