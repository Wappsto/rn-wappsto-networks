import {UUID} from '../uuid';
import Meta from './meta';

interface ResponseJson {
  code?: number;
  message?: string;
  oauth: any[];
  oauth_connect: any[];
  application: string;
  version_id: string;
  name: string;
  author: string;
  supported_features: string[];
  version_app: string;
  session_user: boolean;
  icon: string;
  ignore_this_notification: [];
  token_installation: string;
  extsync: boolean;
  permit_to_send_email: boolean;
  permit_to_send_sms: boolean;
  session: UUID; // x-session id
  status: {
    payment: string;
    background: string;
    version: string;
  };
  description: {
    general: string;
    foreground: string;
    background: string;
    version: string;
  };
  payment: {free: boolean};
  meta: Meta;
}

class ResponseJson {
  static getName<T extends ResponseJson>(dto: T) {
    return dto.name;
  }

  static getAppId<T extends ResponseJson>(dto: T) {
    return dto.application;
  }

  static getInstallationId<T extends ResponseJson>(dto: T) {
    return dto.meta?.id;
  }
}

export default ResponseJson;
