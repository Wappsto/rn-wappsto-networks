import {UUID} from '../uuid';

interface Meta {
  id: UUID;
  type: string;
  version: string;
  owner: UUID;
  manufacturer: UUID;
  created: string;
  updated: string;
  application?: UUID;
  tag: any[];
  tag_by_user: any[];
  name_by_user: string;
  iot: boolean;
  connection?: {
    timestamp: string;
    online: boolean;
  };
  stable_connection?: {
    timestamp: string;
    online: boolean;
  };
}

// ... it's right up there... idk why ESLint swears it's
// eslint-disable-next-line no-undef
export default Meta;
