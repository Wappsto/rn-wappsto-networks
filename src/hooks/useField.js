import { useState, useRef, useCallback } from 'react';

const useField = (defaultValue = '', validator) => {
  const [text, setText] = useState(defaultValue);
  const [visible, setVisible] = useState(false);
  const [blurred, setBlurred] = useState(false);

  const ref = useRef();

  const onBlur = useCallback(() => {
    setBlurred(true);
  }, []);

  const toggleVisible = useCallback(() => {
    setVisible((sp) => !sp);
  }, []);

  const error = blurred && (!text || (validator && !validator(text)));

  return {
    text,
    setText,
    visible,
    toggleVisible,
    onBlur,
    blurred,
    ref,
    error,
  };
};

export default useField;
