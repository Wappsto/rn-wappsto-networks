import React from 'react';
import useLanguageButton from '../hooks/useLanguageButton';
import Button from './Button';

const LanguageButton = React.memo(() => {
  const { changeLanguage, showLanguageButton } = useLanguageButton();
  if(!showLanguageButton){
    return null;
  }
  return (
    <>
      <Button text='en' onPress={() => changeLanguage('en')}/>
      <Button text='da' onPress={() => changeLanguage('da')}/>
    </>
  )
});

export default LanguageButton;
