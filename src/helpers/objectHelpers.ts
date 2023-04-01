import _ from 'lodash';

export default class Obj {
  /** Creates an object from an array of strings */
  static fromArray<T extends string>(arr: T[]): Record<T, T> {
    let result = {} as Record<T, T>;

    // JS usage contingency
    if (!arr.every(x => typeof x === 'string')) {
      throw new Error('The array to be converted must contain strings only');
    }

    arr.forEach(x => {
      result[x] = x;
    });

    return result;
  }

  static stringify<T>(
    obj: object,
    {
      separator = ',',
      kvSeparator = ':',
      leftDelimiter = '{',
      rightDelimiter = '}',
    } = {},
  ) {
    return (
      leftDelimiter +
      _.map(obj, (v, k) => `${k}${kvSeparator}${v}`).join(separator) +
      rightDelimiter
    );
  }

  /** Automatically appends an auto-incremented key to the input array. Note that the input array must be objects */
  static iota<T>({key = 'id', keyGen = x => x + 1} = {}) {
    return (objArr: T[]) => _.map(objArr, (v, k) => ({[key]: keyGen(k), ...v}));
  }
}
