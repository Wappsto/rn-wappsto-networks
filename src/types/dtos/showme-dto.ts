import Arr from '../../helpers/arrayHelpers';
import useDeviceStore from '../../stores/useDeviceStore';
import {UUID} from '../uuid';
import Meta from './meta';
import {immerable} from 'immer';

const ID = 'wapp_storage_showme';
const TYPE = 'wapp_storage';

interface ShowMeDto {
  meta?: Meta;
  data_meta: {
    id: typeof ID;
    type: typeof TYPE;
    version: number;
  };
  data: {
    timezone: 'Europe/Copenhagen';
    language: string;
    configuration: {
      metric: 'energy';
      currency: 'DKK';
      scale_money: number;
      scale_co2: number;
    };
    selected_meter_state_ids: UUID[] | UUID;
    report: {
      selected_meter_id: UUID;
      weekly: {
        enabled: boolean;
      };
      monthly: {
        enabled: boolean;
      };
      yearly: {
        enabled: boolean;
      };
      email_recipients: string[];
    };
  };
}

class ShowMeDto {
  constructor(
    meterId: UUID,
    stateIds: UUID[],
    {
      weekly = false,
      monthly = true,
      yearly = false,
      scale_money = 2.5,
      scale_co2 = 117,
      language = 'en-US',
    } = {},
  ) {
    this.data_meta = {
      id: ID,
      type: TYPE,
      version: 1,
    };

    this.data = {
      timezone: 'Europe/Copenhagen',
      language,
      selected_meter_state_ids: stateIds,
      configuration: {
        metric: 'energy',
        currency: 'DKK',
        scale_money,
        scale_co2,
      },
      report: {
        weekly: {
          enabled: weekly,
        },
        monthly: {
          enabled: monthly,
        },
        yearly: {
          enabled: yearly,
        },
        selected_meter_id: meterId,
        email_recipients: [],
      },
    };

    this[immerable] = true;
  }

  static prepForReport(meterId: UUID) {
    return new ShowMeDto(meterId, [meterId]);
  }

  static fromStore() {
    const stateIds = useDeviceStore.getState().getIds();

    if (Arr.isNullishOrEmpty(stateIds)) {
      return null;
    }

    return new ShowMeDto(stateIds![0], stateIds!);
  }

  /**
   * Convert plain-object DTO as gotten from the server to an instance of the class
   * @param obj plain object
   * @returns class instance
   */
  static fromObject(obj: ShowMeDto) {
    // hopefully this works?
    const instance = new ShowMeDto('', []);
    return Object.assign(instance, obj);
  }

  static isShowMeDto(obj: any): obj is ShowMeDto {
    return obj?.data_meta?.id === ID;
  }

  static fetchURL = `/data?expand=1&this_data_meta.id==${ID}`;
}

export default ShowMeDto;
