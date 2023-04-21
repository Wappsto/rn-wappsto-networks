import { useCallback } from 'react';
import { useRequest } from 'wappsto-blanket';
import HTTP from '../enums/http';

export default function useApi(url) {
  const { send, request, requestId, setRequestId, removeRequest } = useRequest();

  const get = useCallback(
    body =>
      send({
        method: HTTP.GET,
        url,
        body,
      }),
    [url, send],
  );

  const put = useCallback(
    body =>
      send({
        method: HTTP.PUT,
        url,
        body,
      }),
    [url, send],
  );

  const post = useCallback(
    body => {
      send({
        method: HTTP.POST,
        url,
        body,
      });
    },
    [url, send],
  );

  const patch = useCallback(
    body => {
      send({
        method: HTTP.PATCH,
        url,
        body,
      });
    },
    [url, send],
  );

  const del = useCallback(
    body =>
      send({
        method: HTTP.DELETE,
        url,
        body,
      }),
    [url, send],
  );

  return {
    get,
    put,
    post,
    patch,
    del,
    request,
    requestId,
    setRequestId,
    removeRequest,
  };
}
