import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStreamSelector, streamStatus, steps } from 'wappsto-redux';
import { config } from '../configureWappstoRedux';
import { CapitalizeFirst, useTranslation } from '../translations';
import { startStream } from '../util/helpers';

const emptyObject = {};
const useStreamStatus = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector(state => {
    if (!config.stream) {
      return emptyObject;
    }
    return getStream(state, config.stream.name);
  });

  const reconnectStream = useCallback(() => {
    startStream(dispatch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stream]);

  let message;
  if (stream) {
    let mStatus = '',
      mStep;
    switch (stream.status) {
      case streamStatus.CONNECTING:
      case streamStatus.RECONNECTING:
        mStatus =
          stream.status === streamStatus.CONNECTING
            ? CapitalizeFirst(t('statusMessage.connecting'))
            : CapitalizeFirst(t('statusMessage.reconnecting'));
        switch (stream.step) {
          case steps.CONNECTING.GET_STREAM:
            mStep = CapitalizeFirst(t('statusMessage.gettingStream'));
            break;
          case steps.CONNECTING.CREATE_STREAM:
            mStep = CapitalizeFirst(t('statusMessage.creatingStream'));
            break;
          case steps.CONNECTING.UPDATE_STREAM:
            mStep = CapitalizeFirst(t('statusMessage.updatingStream'));
            break;
          case steps.CONNECTING.OPENING_SOCKET:
          case steps.CONNECTING.WAITING:
            mStep = CapitalizeFirst(t('statusMessage.openingConnection'));
            break;
        }
        break;
      case streamStatus.OPEN:
        mStatus = CapitalizeFirst(t('statusMessage.streamOpen'));
        break;
      case streamStatus.CLOSED:
        mStatus = CapitalizeFirst(t('statusMessage.streamClosed'));
        if (stream.code) {
          mStep = CapitalizeFirst(t('error:stream.code.' + stream.code));
        }
        break;
      case streamStatus.ERROR:
        mStatus = CapitalizeFirst(t('error:generic'));
        break;
      case streamStatus.LOST:
        mStatus = CapitalizeFirst(t('error:stream.connectionLost'));
        break;
    }
    message = mStatus + (mStep ? '\n' + mStep : '');
  }

  return { stream, reconnectStream, message };
};

export default useStreamStatus;
