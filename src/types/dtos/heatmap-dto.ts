import Arr from '../../helpers/arrayHelpers';
import useDeviceStore from '../../stores/useDeviceStore';
import {ISODateString} from '../date';
import {UUID} from '../uuid';

interface HeatmapDto {
  parameter: {
    x_axis: 'dayofweek';
    y_axis: 'hourofday';
    summarize_with: 'mean';
    start: ISODateString;
    end: ISODateString;
    timezone: 'Europe/Copenhagen';
  };
  access: {
    state_id: UUID[];
  };
}

class HeatmapDto {
  constructor(startDate: Date, endDate: Date, stateIds: UUID[]) {
    this.parameter = {
      x_axis: 'dayofweek',
      y_axis: 'hourofday',
      summarize_with: 'mean',
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      timezone: 'Europe/Copenhagen',
    };

    this.access = {
      state_id: stateIds,
    };
  }

  static fromStore(startDate: Date, endDate: Date) {
    const stateIds = useDeviceStore.getState().getIds();

    if (Arr.isNullishOrEmpty(stateIds)) {
      return null;
    }

    return new HeatmapDto(startDate, endDate, stateIds!);
  }
}

export default HeatmapDto;
