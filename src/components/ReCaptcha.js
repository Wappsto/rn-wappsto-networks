import React, { PureComponent } from 'react';
import { WebView } from 'react-native-webview';

const recaptchaHtml = `<!DOCTYPE html>
<html>
<head>
  <script src="https://www.google.com/recaptcha/api.js?render=explicit&onload=onRecaptchaLoadCallback"></script>
  <script>
    function onRecaptchaLoadCallback() {
      var clientId = grecaptcha.render('inline-badge', {
        'sitekey': '[SITEKEY]'
      });
      grecaptcha.ready(function () {
        grecaptcha.execute(clientId, {
          action: 'verify'
        })
          .then(function (token) {
            window.ReactNativeWebView.postMessage(token, '*')
          });
      });
    }
  </script>
  <style>
    body {
      display: flex;
      justify-content: left;
      align-items: top;
    }
  </style>
</head>
<body>
  <div id="inline-badge" class="g-recaptcha" data-sitekey="{{config.captchaKey}}"></div>
</body>
</html>`;

class ReactNativeRecaptchaV3 extends PureComponent {
  render() {
    const { onCheck, url, siteKey } = this.props;
    const recaptchaHtmlWithKey = recaptchaHtml.replace('[SITEKEY]', siteKey);

    return (
      <WebView
        originWhitelist={['*']}
        style={{ height: 300, width: 300 }}
        startInLoadingState
        javaScriptEnabledAndroid
        javaScriptEnabled
        source={{ html: recaptchaHtmlWithKey, baseUrl: url }}
        onMessage={event => onCheck(event.nativeEvent.data)}
      />
    );
  }
}

export default ReactNativeRecaptchaV3;
