import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAvoidingView from '../../../../components/KeyboardAvoidingView';
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
          text={CapitalizeFirst(t('genericButton.cancel'))}
        />
      </View>
        <KeyboardAvoidingView>
      <ScrollView>
        <View style={theme.common.contentContainer}>
            {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

export default BackHandlerView;
