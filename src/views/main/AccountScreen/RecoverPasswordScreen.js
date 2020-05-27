import React from 'react';
import { ScrollView } from 'react-native';
import Screen from '../../../components/Screen';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useUser from '../../../hooks/useUser';

const RecoverPassword = React.memo(() => {
  const { t } = useTranslation();
  const { request, session } = useUser();

  return (
    <Screen>
      <ScrollView style={theme.common.contentContainer}>
        <Text
          size='p'
          content={CapitalizeFirst(t('account:recoverPasswordInfo'))}
        />
        <Input
          value={session.username}
          label={CapitalizeFirst(t('account:email'))}
        />
        <Button
          display='block'
          text={CapitalizeFirst(t('genericButton.send'))}
        />
        <RequestError request={request} />
      </ScrollView>
    </Screen>
  );
});

RecoverPassword.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.recoverPassword')))
  };
};

export default RecoverPassword;
