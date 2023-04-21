import Meta from './meta';
import {immerable} from 'immer';

const ID = 'ems_native_setup';
const TYPE = 'ems_native';

export enum SETUP_STATUS {
  PENDING = 'pending',
  SKIPPED = 'skipped',
  DONE = 'done',
}

interface SetupStatusDto {
  data_meta: {
    id: typeof ID;
    type: typeof TYPE;
  };
  eloverblik: SETUP_STATUS;
  reports: SETUP_STATUS;
  devices: SETUP_STATUS;
  meta?: Meta;
}

class SetupStatusDto {
  constructor() {
    this.data_meta = {
      id: ID,
      type: TYPE,
    };
    this.eloverblik = SETUP_STATUS.PENDING;
    this.reports = SETUP_STATUS.PENDING;
    this.devices = SETUP_STATUS.PENDING;
    this[immerable] = true;
  }

  /** Wraps the naked dto in an object instance */
  static fromObject(obj: SetupStatusDto) {
    const instance = new SetupStatusDto();
    return Object.assign(instance, obj);
  }

  static isSetupStatusState = (obj: any): obj is SetupStatusDto =>
    obj?.data_meta?.id === ID;

  static fetchURL = `/data?expand=1&this_data_meta.id==${ID}`;
}

export default SetupStatusDto;
