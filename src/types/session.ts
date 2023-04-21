import {UUID} from './uuid';

interface Session {
  meta: {
    created: string;
    deprecated: true;
    id: UUID;
    manufacturer: UUID;
    name_by_user: string;
    owner: UUID;
    tag: any[];
    tag_by_user: any[];
    type: string;
    updated: string;
    version: string;
  };
  provider: string;
  remember_me: boolean;
  system: string;
  to_upgrade: boolean;
  type: string;
  upgrade: boolean;
  valid: boolean;
}

class Session {
  static id(session: Session) {
    return session.meta.id;
  }
}

export default Session;
