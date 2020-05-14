import React from 'react';
import { ScrollView } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useUser from '../../../hooks/useUser';

const ChangeUsernameScreen = React.memo(() => {
  const { t } = useTranslation();
  const { request, session } = useUser();

  return (
    <ScrollView style={[theme.common.container, theme.common.contentContainer]}>
      <Text
        size='p'
        content={CapitalizeFirst(t('account:changeUsernameInfo'))}
      />
      <Input
        value={session.username}
        label={CapitalizeFirst(t('account:username'))}
      />
      <Input
        label={CapitalizeFirst(t('account:password'))}
      />
      <Input
        label={CapitalizeFirst(t('account:newUsername'))}
      />
      <Button
        display='block'
        text={CapitalizeFirst(t('genericButton.send'))}
      />
      <RequestError request={request} />
    </ScrollView>
  );
});

ChangeUsernameScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.changeUsername')))
  };
};

export default ChangeUsernameScreen;
