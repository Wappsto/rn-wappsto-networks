import dayjs from 'dayjs';
import useDeviceStore from '../../stores/useDeviceStore';
import {ISODateString} from '../date';
import {UUID} from '../uuid';
import {Device} from './device-with-energy';
import utc from 'dayjs/plugin/utc';
import Arr from '../../helpers/arrayHelpers';

dayjs.extend(utc);

interface EnergySummaryDto {
  parameter: {
    start: ISODateString;
    end: ISODateString;
  };
  access: {
    state_id: UUID[];
  };
}

class EnergySummaryDto {
  constructor(stateIds: UUID[]) {
    const date = dayjs().utc();
    this.parameter = {
      start: date.startOf('month').toISOString(),
      end: date.toISOString(), // date.endOf('month').toISOString(),
    };

    this.access = {
      state_id: stateIds,
    };
  }

  static fromStore() {
    const stateIds = useDeviceStore
      .getState()
      .devices?.flatMap(d => Device.getStateIdsBy(d, x => x.type === 'energy'));

    if (Arr.isNullishOrEmpty(stateIds)) {
      return null;
    }

    return new EnergySummaryDto(stateIds!);
  }
}

export default EnergySummaryDto;
