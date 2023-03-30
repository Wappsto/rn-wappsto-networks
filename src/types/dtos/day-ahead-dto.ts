import {ISODateString} from '../date';

interface DayAheadDto {
  start: ISODateString;
  end: ISODateString;
  region: 'DK2' | 'DK1';
  provider: 'energidataservice';
}

class DayAheadDto {
  constructor(startDate: Date, endDate: Date, region: 'DK1' | 'DK2') {
    this.start = startDate.toISOString();
    this.end = endDate.toISOString();
    this.region = region;
    this.provider = 'energidataservice';
  }
}

export default DayAheadDto;
