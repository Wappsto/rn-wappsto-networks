import React from 'react';
import Input from '../../../../components/Input';
import Text from '../../../../components/Text';
import Button from '../../../../components/Button';
import { useTranslation, CapitalizeFirst } from '../../../../translations';
import useConfigureWifi from '../../../../hooks/setup/blufi/useConfigureWifi';

const ConfigureWifi = React.memo(({ next, previous, ssid, setSsid, password, setPassword }) => {
  const { t } = useTranslation();
  const { showPassword, toggleShowPassword, handleTextChange, passwordInputRef, moveToPasswordField } = useConfigureWifi(ssid, setSsid, password, setPassword);

  return (
    <>
      <Text
        size='h3'
        content={CapitalizeFirst(t('onboarding.wifiConfig.title'))}
      />
      <Text
        size='p'
        content={CapitalizeFirst(t('onboarding.wifiConfig.intro')) + ' ' +  CapitalizeFirst(t('onboarding.wifiConfig.warning5Ghz'))}
        />
      <Input
        label={CapitalizeFirst(t('onboarding.wifiConfig.ssidLabel'))}
        onChangeText={ssidText =>
          handleTextChange(ssidText, 'ssid')
        }
        value={ssid}
        autoCapitalize='none'
        onSubmitEditing={moveToPasswordField}
        returnKeyType='next'
      />
      <Input
        inputRef={passwordInputRef}
        label={CapitalizeFirst(t('onboarding.wifiConfig.passwordLabel'))}
        onChangeText={passwordText =>
          handleTextChange(passwordText, 'password')
        }
        value={password}
        textContentType='password'
        secureTextEntry={!showPassword}
        autoCapitalize='none'
        onSubmitEditing={next}
        showPassword={showPassword}
        toggleShowPassword={toggleShowPassword}
      />
      <Button
        display='block'
        color='primary'
        onPress={next}
        text={CapitalizeFirst(t('onboarding.wifiConfig.sendButton'))}
      />
    </>
  );
});

export default ConfigureWifi;
