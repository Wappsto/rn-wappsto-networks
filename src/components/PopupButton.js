import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from 'wappsto-redux';
import Button from '../components/Button';

const PopupButton = React.memo(({ icon, style, color, showItem, hideItem, children }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);

  const showPopup = useCallback(() => {
    setModalVisible(true);
  }, []);

  const hidePopup = useCallback(() => {
    setModalVisible(false);
  }, []);

  useEffect(() => {
    if (showItem) {
      dispatch(setItem(showItem, () => showPopup));
    }
    if (hideItem) {
      dispatch(setItem(hideItem, () => hidePopup));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button onPress={showPopup} type="link" icon={icon} color={color} style={style} />
      {children(modalVisible, hidePopup, showPopup)}
    </>
  );
});

PopupButton.displayName = 'PopupButton';
export default PopupButton;
