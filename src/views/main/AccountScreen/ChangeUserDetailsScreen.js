import React from 'react';
import { ScrollView } from 'react-native';
import Text from '../../../components/Text';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import RequestError from '../../../components/RequestError';
import theme from '../../../theme/themeExport';
import { useTranslation, CapitalizeFirst, CapitalizeEach } from '../../../translations';
import useUser from '../../../hooks/useUser';

const ChangeUserDetailsScreen = React.memo(() => {
  const { t } = useTranslation();
  const { user, request} = useUser();
  const disabled = true; // TODO: disabled only if email is invalid when it is entered.

  return (
    <ScrollView style={[theme.common.container, theme.common.contentContainer]}>
      <Input
        value={user.first_name}
        label={CapitalizeFirst(t('account:firstName'))}
      />
      <Input
        value={user.last_name}
        label={CapitalizeFirst(t('account:lastName'))}
      />
      <Input
        value={user.nickname}
        label={CapitalizeFirst(t('account:nickname'))}
      />
      <Input
        value={user.email}
        label={CapitalizeFirst(t('account:email'))}
      />
      <Input
        value={user.phone}
        label={CapitalizeFirst(t('account:phone'))}
      />
      <Button
        display='block'
        disa
        color={disabled ? 'disabled' : 'primary'}
        text={CapitalizeFirst(t('genericButton.save'))}
      />
      <RequestError request={request} />
    </ScrollView>
  );
});

ChangeUserDetailsScreen.navigationOptions = ({ navigation, screenProps: { t } }) => {
  return {
    ...theme.headerStyle,
    title: navigation.getParam('title', CapitalizeEach(t('pageTitle.changeUserDetails')))
  };
};

export default ChangeUserDetailsScreen;
