import React, { useState, useEffect } from 'react';
import { Text as RNText, View, StyleSheet } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import Text from './Text';
import Button from './Button';
import theme from '../theme/themeExport';

const styles = StyleSheet.create({
  label:{
    marginBottom: 20,
    backgroundColor: theme.variables.secondary,
    paddingVertical: 3
  }
});

const ID = React.memo(({ id, label }) => {
  const [copiedText, setCopiedText] = useState('Nothing copied yet');
  const [copiedTextVisible, setCopiedTextVisible] = useState(false);

  const copyToClipboard = (id) => {
    Clipboard.setString(id);
    setCopiedText(id);
    setCopiedTextVisible(true);
  }

  useEffect(() => {
    let t;
    if(copiedTextVisible){
      t = setTimeout(() => {
        setCopiedTextVisible(false);
      }, 3000);
    }
    return () => {
      clearTimeout(t);
    }
  }, [copiedTextVisible]);

  if(!id) return '';

  return (
    <>
      <View style={theme.common.row}>
        <RNText style={{flex:1}}>
          <Text bold content={label + ': '}/>
          <Text content={id}/>
        </RNText>
        <Button onPress={() => copyToClipboard(id)} type='link' color='primary' icon='clipboard'/>
      </View>
      {copiedTextVisible &&
        <View style={styles.label}>
          <Text align='center' color={theme.variables.textInverse} content={'Copied: ' + copiedText}/>
        </View>
      }
    </>
  )
});

export default ID;
