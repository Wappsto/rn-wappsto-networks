import HTTP from '../../enums/http';
import STATUS from '../../enums/status';
import {UUID} from '../uuid';
import ErrorResponseJson from './error-response-json';
import ResponseJson from './response-json';

interface WappstoRequest<Json = ResponseJson> {
  body: {
    application: UUID;
  };
  id: string;
  json: Json;
  method: typeof HTTP[keyof typeof HTTP];
  options: object;
  promise: object;
  responseStatus: number;
  status: STATUS;
  text?: string;
  url: string;
}

class WappstoRequest<Json = ResponseJson> {
  static hasJson(request?: WappstoRequest) {
    return request?.json !== undefined;
  }

  static hasJsonArray(request?: WappstoRequest) {
    return Array.isArray(request?.json);
  }

  static fromObject<Json = ResponseJson>(
    obj: WappstoRequest<Json> | undefined,
  ): WappstoRequest<Json> | undefined {
    if (!obj) {
      return obj;
    }

    const instance = new WappstoRequest<Json>();
    Object.assign(instance, obj);
    return instance;
  }

  isPending() {
    return this.status === STATUS.PENDING;
  }

  isError() {
    return this.status === STATUS.ERROR;
  }

  asError() {
    return this as WappstoRequest<ErrorResponseJson>;
  }

  isIdle() {
    return this.status === STATUS.IDLE;
  }

  isCanceled() {
    return this.status === STATUS.CANCELED;
  }

  isSuccessful() {
    return this.status === STATUS.SUCCESS;
  }

  isUnfinished() {
    return this.isIdle() || this.isPending();
  }

  isFinished() {
    return this.isCanceled() || this.isError() || this.isSuccessful();
  }
}

export default WappstoRequest;
