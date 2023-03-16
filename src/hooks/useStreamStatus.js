import { useMemo, useCallback } from 'react';
import { config } from '../configureWappstoRedux';
import { useSelector, useDispatch } from 'react-redux';
import { makeStreamSelector } from 'wappsto-redux/selectors/stream';
import { startStream } from '../util/helpers';
import { status, steps } from 'wappsto-redux/actions/stream';
import { useTranslation, CapitalizeFirst } from '../translations';

const emptyObject = {};
const useStreamStatus = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const getStream = useMemo(makeStreamSelector, []);
  const stream = useSelector((state) => {
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
      case status.CONNECTING:
      case status.RECONNECTING:
        mStatus =
          stream.status === status.CONNECTING
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
      case status.OPEN:
        mStatus = CapitalizeFirst(t('statusMessage.streamOpen'));
        break;
      case status.CLOSED:
        mStatus = CapitalizeFirst(t('statusMessage.streamClosed'));
        if (stream.code) {
          mStep = CapitalizeFirst(t('error:stream.code.' + stream.code));
        }
        break;
      case status.ERROR:
        mStatus = CapitalizeFirst(t('error:generic'));
        break;
      case status.LOST:
        mStatus = CapitalizeFirst(t('error:stream.connectionLost'));
        break;
    }
    message = mStatus + (mStep ? '\n' + mStep : '');
  }

  return { stream, reconnectStream, message };
};

export default useStreamStatus;
