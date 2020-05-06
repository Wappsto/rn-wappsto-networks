import React, { useState, useCallback } from 'react';
import Button from '../components/Button';

const PopupButton = React.memo(({ icon, style, color, children }) => {
  const [ modalVisible, setModalVisible ] = useState(false);

  const showPopup = useCallback(() => {
    setModalVisible(true);
  }, []);

  const hidePopup = useCallback(() => {
    setModalVisible(false);
  }, []);
  return (
    <>
      <Button
        onPress={showPopup}
        type='link'
        icon={icon}
        color={color}
        style={style}
      />
      {children(
        modalVisible,
        hidePopup,
        showPopup,
      )}
    </>
  );
});

export default PopupButton;
