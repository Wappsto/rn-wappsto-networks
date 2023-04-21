import _ from 'lodash';

/** A type alias which classifies non-empty arrays. By contrast, an empty array is of type `[]` */
export type NonEmptyArray<T> = [T, ...T[]] | [...T[], T] | [T, ...T[], T];

/**
 * Array helper functions useful for various esoteric everyday array tasks.
 * Contains (among other things)
 * - Array generator functions
 * - Advanced indexing and slicing functions
 * - Querying functions
 */
export default class Arr {
  /** Creates an array from a string */
  static fromString(str: string, separator = ' '): string[] {
    if (typeof str !== 'string') {
      throw new Error(`The input ${str} is not a valid string`);
    }

    return str.split(separator);
  }

  /** Returns an array of the values chosen by the indices */
  static indices<T>(arr: T[], ...indices: number[]): T[] {
    return arr.filter((v, k) => indices.includes(k));
  }

  /** Given an array mask consisting of boolean values of the same length as the source array,
   * The resulting array will be filtered by the presence of the "true" and the "false" values.
   *
   * ```
   * arr   : [ foo,   bar,   baz, bing,  boop]
   * mask  : [true, false, false, true, false]
   * result: [ foo,               bing       ]
   * ```
   * Note: If the arrays are of different lengths, the output will be defined by the shorter array.
   */
  static mask<T>(arr: T[], mask: boolean[]): T[] {
    return _.zip(arr, mask)
      .filter(([_a, b]) => b)
      .map(([a, _b]) => a) as T[];
  }

  /** Creates an array of value `val` repeated `count` times. */
  static repeat<T>(val: T, count: number): T[] {
    return _.fill(Array(count), val);
  }

  /**
   * Takes an array of elements and an array of counts and repeats each value that number of times.
   * @param arr The input array
   * @param counts The counts
   */
  static replicate<T>(arr: T[], counts: number[]): T[] {
    let result: T[] = [];

    _.zipWith(arr, counts, (a, c) => Arr.repeat(a, c)).forEach(a => {
      result = result.concat(a);
    });

    return result;
  }

  /** Generates an index array */
  static iota(num: number): number[] {
    return _.range(num);
  }

  /** Returns the default value if the array is empty */
  static firstOrDefault<T>(arr: T[], defaultVal: T): T {
    return Arr.isNotEmpty(arr) ? arr[0] : defaultVal;
  }

  /** Returns the result of the function if the array is empty. Useful for delayed execution */
  static firstOrElse<T>(arr: T[], fn: () => T): T {
    return Arr.isNotEmpty(arr) ? arr[0] : fn();
  }

  /** Checks if the array is empty */
  static isEmpty<T>(arr: T[]): arr is [] {
    return arr.length === 0;
  }

  /** Checks if the array is not empty */
  static isNotEmpty<T>(arr: T[]): arr is NonEmptyArray<T> {
    return !Arr.isEmpty(arr);
  }

  /** Checks if the array is a nullish value (null/undefined) or empty */
  static isNullishOrEmpty<T>(
    arr: T[] | null | undefined,
  ): arr is null | undefined | [] {
    return _.isEmpty(arr); // also does nullish checks. Not desirable in all cases
  }

  /** Checks if the array is not a nullish value (null/undefined) or empty */
  static isNotNullishOrEmpty<T>(
    arr: T[] | null | undefined,
  ): arr is NonEmptyArray<T> {
    return !Arr.isNullishOrEmpty(arr);
  }

  /** Returns true if any one is true */
  static some<T>(arr: T[], fn: (x: T) => boolean = x => Boolean(x)): boolean {
    return arr.some(fn);
  }

  /** Returns true if all are true */
  static every<T>(arr: T[], fn: (x: T) => boolean = x => Boolean(x)): boolean {
    return arr.every(fn);
  }

  /** Returns true if all are false */
  static none<T>(arr: T[], fn: (x: T) => boolean = x => Boolean(x)): boolean {
    return !arr.some(fn);
  }
}
