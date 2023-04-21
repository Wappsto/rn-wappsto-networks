import {ISODateString} from '../date';
import {UUID} from '../uuid';
import Meta from './meta';

export interface EnergySummaryResult {
  id: UUID;
  total_energy: number;
  min_power: number;
  max_power: number;
  mean_power: number;
  median_power: number;
  sd_power: number;
}

export default interface EnergySummaryResponseJson {
  status: 'completed' | 'cached' | 'pending';
  operation: 'energy_summary';
  version: string;
  parameter: {
    start: ISODateString;
    end: ISODateString;
  };
  access: {state_id: UUID[]};
  result: EnergySummaryResult[];
  meta: Meta;
}
