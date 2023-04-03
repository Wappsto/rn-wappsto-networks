import Clipboard from '@react-native-community/clipboard';
import React, { useEffect, useState } from 'react';
import { Text as RNText, StyleSheet, View } from 'react-native';
import theme from '../theme/themeExport';
import Button from './Button';
import Text from './Text';

const styles = StyleSheet.create({
  label: {
    marginBottom: 20,
    backgroundColor: theme.variables.secondary,
    paddingVertical: 3,
  },
});

const ID = React.memo(({ id, label }) => {
  const [copiedText, setCopiedText] = useState('Nothing copied yet');
  const [copiedTextVisible, setCopiedTextVisible] = useState(false);

  const copyToClipboard = id => {
    Clipboard.setString(id);
    setCopiedText(id);
    setCopiedTextVisible(true);
  };

  useEffect(() => {
    let t;
    if (copiedTextVisible) {
      t = setTimeout(() => {
        setCopiedTextVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(t);
    };
  }, [copiedTextVisible]);

  if (!id) {
    return '';
  }

  return (
    <>
      <View style={theme.common.row}>
        <RNText style={{ flex: 1 }}>
          <Text bold content={label + ': '} />
          <Text content={id} />
        </RNText>
        <Button onPress={() => copyToClipboard(id)} type="link" color="primary" icon="clipboard" />
      </View>
      {copiedTextVisible && (
        <View style={styles.label}>
          <Text
            align="center"
            color={theme.variables.textInverse}
            content={'Copied: ' + copiedText}
          />
        </View>
      )}
    </>
  );
});

ID.displayName = 'ID';
export default ID;
