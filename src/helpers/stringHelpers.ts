import _ from 'lodash';
import {Receivable} from '../types/receivable';
import {UUID} from '../types/uuid';
import Fn from './functionHelpers';

namespace Str {
  // Regexes used internally on Wappsto.
  export const emailRegex = /^\S+@\S+\.\S+$/;
  export const strongPasswordRegex =
    /^(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.*[A-Z]).{6,100}$/;
  export const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  export const uuidCaptureRegex =
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;

  /**
   * Checks if the input is a valid email address.
   *
   * **NB**: uses the same email validation pattern as that found on the wappsto API documentation.
   * @returns true if the email address is valid
   */
  export function isEmail(str: Receivable<string>): boolean {
    return !_.isNil(str) && emailRegex.test(str);
  }

  /**
   * Uses Stefano's password regex to validate if a password is strong or not
   * @returns true if the password is considered strong
   */
  export function isStrongPassword(str: Receivable<string>): boolean {
    return !_.isNil(str) && strongPasswordRegex.test(str);
  }

  /**
   * Checks if a given string matches the UUID format criteria used by wappsto
   * @param uuid input string
   * @returns true if it matches
   */
  export function isUuid(uuid: Receivable<string>): uuid is UUID {
    if (_.isNil(uuid)) {
      return false;
    }

    return uuidRegex.test(uuid);
  }

  /**
   * Inserts text into a format string of the shape "foo {0} bar {1}" where the numbers indicate the index in the variable args that follow
   * @param formatString the format string with holes specified by numbers in curly braces
   * @param args the args that follow, in the order used by the numbers
   * @returns the resulting combined string
   */
  export function format(formatString: string, ...args: any[]): string {
    return formatString.replace(/\{([0-9]+)\}/g, (match, i) =>
      typeof args[i] === 'undefined' ? match : args[i],
    );
  }

  /**
   * Capitalises the first letter in the input
   */
  export function capitalizeFirst(str: string): string {
    if (str.length === 0) {
      return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /**
   * Capitalises the first letter in each word
   */
  export function capitalizeEach(str: string): string {
    return str.replace(/\w\S*/g, Str.capitalizeFirst);
  }

  export function titleCase(str: string): string {
    return str.replace(/^[\w-]+|[\w-]{4,}|[\w-]+$/g, Str.capitalizeFirst);
  }

  export function uppercase(str: string) {
    return str.toUpperCase();
  }

  /**
   * Joins an array of strings by first removing empty strings, nulls, and undefineds
   * @param arr input array
   * @param sep separator
   * @returns a string
   */
  export function smartJoin(
    arr: (string | null | undefined)[],
    sep: string,
  ): string {
    return arr.filter(Fn.id).join(sep);
  }
}

export default Str;
