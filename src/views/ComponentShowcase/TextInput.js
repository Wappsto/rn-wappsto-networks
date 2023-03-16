import React, { useState, useCallback } from 'react';
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
    flex: 1,
  },
});

const TextInputShowcase = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = useCallback(() => {
    setShowPassword((sp) => !sp);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <ScrollView style={styles.content}>
          <Input />
          <Input label="Input with label" placeholder="Placeholder text" />
          <Input disabled label="Disabled input" />
          <Input disabled label="Disabled input" value="some text" />
          <Input
            value="password"
            label="Label text"
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
          />
          <Input
            value="][p¬=-4 0"
            label="Invalid email"
            textContentType="emailAddress"
            keyboardType="email-address"
            validationError="Invalid input"
          />
          <Input
            value="password"
            label="Invalid input with icon"
            secureTextEntry={!showPassword}
            showPassword={showPassword}
            toggleShowPassword={toggleShowPassword}
            validationError="invalid input"
          />
          <Input
            label="Long multiline text"
            value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            multiline
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TextInputShowcase;
