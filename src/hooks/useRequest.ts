import {useMemo} from 'react';
import {useRequest as useBlanketRequest} from 'wappsto-blanket';
import HTTP from '../enums/http';
import ResponseJson from '../types/dtos/response-json';
import WappstoRequest from '../types/dtos/wappsto-request';

export interface Sendable {
  method: typeof HTTP[keyof typeof HTTP];
  url: string;
  body?: object;
  headers?: object;
  query?: object;
}

/**
 * Typed Wrapper around wappsto-blanket's useRequest.
 * @returns the same items as the original useRequest, but typed.
 */
const useRequest = <Json = ResponseJson>(
  id?: string,
  removeOldRequest?: boolean,
) => {
  const {request, requestId, setRequestId, send, removeRequest} =
    useBlanketRequest(id, removeOldRequest);

  const req = useMemo(
    () =>
      WappstoRequest.fromObject<Json>(
        request as WappstoRequest<Json> | undefined,
      ),
    [request],
  );

  return {
    send: send as (obj: Sendable) => void,
    request: req,
    requestId: requestId as string,
    setRequestId: setRequestId as (id: string) => void,
    removeRequest: removeRequest as () => void,
  };
};

export default useRequest;
