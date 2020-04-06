import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import i18n from 'rn-wappsto-networks/src/translations';
import { config } from '../configureWappstoRedux';

const generateWebViewContent = (siteKey, languageCode) => {
  const originalForm =
    `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <script src="https://recaptcha.google.com/recaptcha/api.js?explicit&hl=${languageCode || 'en'}"></script>
      <script type="text/javascript">
      var onloadCallback = function() { };
      var onDataCallback = function(response) {
        window.ReactNativeWebView.postMessage(response);
      };
      </script>
    </head>
    <body style="text-align:center;padding:0">
      <div
        style="width:300px; margin:auto;"
        class="g-recaptcha"
        data-sitekey="${siteKey}" data-callback="onDataCallback">
      </div>
    </body>
    </html>`;
  return originalForm;
};

const ReCaptcha = React.memo(({ onCheck, style, extraData }) => {
  const webview = useRef();

  useEffect(() => {
    if(webview.current){
      webview.current.reload();
    }
  }, [extraData]);

  return (
    <WebView
      ref={webview}
      originWhitelist={['*']}
      style={style || {minHeight:100}}
      startInLoadingState
      javaScriptEnabledAndroid
      javaScriptEnabled
      source={{ html: generateWebViewContent(config.recaptchaKey, i18n.language), baseUrl: config.baseUrl.replace('/services', '') }}
      onMessage={event => onCheck(event.nativeEvent.data)}
    />
  );
});

export default ReCaptcha;
