import React from 'react';
import { ScrollView } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useUser from '../../../hooks/useUser';

const ChangePassword = React.memo(() => {
  const { t } = useTranslation();
  const { user, request } = useUser();

  return (
    <ScrollView style={[theme.common.container, theme.common.contentContainer]}>
      <Text
        size='p'
        content={CapitalizeFirst(t('account:changePasswordInfo'))}
      />
      <Input
        label={CapitalizeFirst(t('account:currentPassword'))}
      />
      <Input
        label={CapitalizeFirst(t('account:newPassword'))}
      />
      <Input
        label={CapitalizeFirst(t('account:repeatPassword'))}
      />
      <Button
        display='block'
        text={CapitalizeFirst(t('genericButton.save'))}
      />
      <RequestError request={request} />
    </ScrollView>
  );
});

ChangePassword.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.changePassword')))
  };
};

export default ChangePassword;
