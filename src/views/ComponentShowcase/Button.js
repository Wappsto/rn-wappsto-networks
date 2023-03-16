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

const ButtonShowcase = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Button color="primary" text="Primary button" />
        <Button color="primary" type="outlined" text="Outlined primary button" />
        <Button color="primary" type="link" text="Link primary button" />
        <Button text="Button" />
        <Button type="outlined" text="Outlined button" />
        <Button type="link" text="Link button" />
        <Button disabled text="Disabled button" />
        <Button disabled type="outlined" text="Disabled outlined button" />
        <Button disabled type="link" text="Disabled link button" />
        <Button icon="send" display="block" text="Block button with icon" />
        <Button icon="send" color="#fc13bd" text="Custom colour button with icon" />
        <Button
          icon="send"
          type="outlined"
          color="#fc13bd"
          text="Custom colour outlined button with icon and long text"
        />
        <Button
          bold
          icon="send"
          type="link"
          align="left"
          text="Bold link button with icon (left)"
        />
        <Button bold align="right" text="Bold button (right)" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ButtonShowcase;
