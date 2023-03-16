import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
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

const ComponentShowcase = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button
          color="primary"
          type="link"
          text="Button styles"
          onPress={() => navigation.navigate('ButtonShowcase')}
        />
        <Button
          color="primary"
          type="link"
          text="Text input styles"
          onPress={() => navigation.navigate('TextInputShowcase')}
        />
        <Button
          color="primary"
          type="link"
          text="Numeric input styles"
          onPress={() => navigation.navigate('NumericInputShowcase')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ComponentShowcase;
