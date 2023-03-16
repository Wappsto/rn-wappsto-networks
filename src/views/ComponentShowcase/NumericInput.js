import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/Input';
import KeyboardAvoidingView from '../../components/KeyboardAvoidingView';
import theme from '../../theme/themeExport';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.variables.appBgColor,
  },
  content: {
    padding: 10,
  },
});

const TextInputShowcase = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView style={styles.content}>
          <Input />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TextInputShowcase;
