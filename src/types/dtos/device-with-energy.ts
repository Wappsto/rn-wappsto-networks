import {UUID} from '../uuid';

export interface DeviceValue {
  meta: {id: UUID};
  name: 'Energy';
  number: {unit: 'kWh'};
  type: 'energy';
  state: {meta: {id: UUID}}[];
}

export interface Device {
  manufacturer: string;
  meta: {id: UUID};
  name: string;
  product: string;
  value: DeviceValue[];
}

export namespace Device {
  export const getDeviceId = (device: Device) => device.meta.id;

  export const getStateIds = (device: Device) =>
    device.value.flatMap(x => x.state).map(x => x.meta.id);

  export const getStateIdsBy = (
    device: Device,
    filter: (val: DeviceValue) => boolean,
  ) =>
    device.value
      .filter(filter)
      .flatMap(x => x.state)
      .map(x => x.meta.id);
}

export interface DeviceJson {
  meta: {
    type: 'fetch';
    version: '2.1';
  };
  data: {
    device: Device[];
  };
}

export namespace DeviceJson {
  export const hasDevice = (json: DeviceJson, name: string) =>
    json.data.device.some(x => x.name === name);
}
