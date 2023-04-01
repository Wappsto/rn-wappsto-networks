import _ from 'lodash';

/* eslint-disable no-bitwise */
namespace Fn {
  /** No operation. A function that does nothing */
  export const nop = (..._ignore: any) => {};

  /** Identity function. Returns its own input */
  export const id = <T>(x: T) => x;

  /**
   * Creates a function that returns a constant value `x` regardless of input
   *
   * Use Case:
   * ```
   * const arr = [...]; // an array of random data
   * const isNum = x => typeof x === 'number';
   *
   * // converts the array of random data to an array of numbers, where all non-numbers are 0
   * const result = arr.map(x => isNum(x) ? x : Fn.constant(0)(x));
   * ```
   */
  export const constant =
    <T>(x: T) =>
    (..._ignore: any) =>
      x;

  /** Constructs a new binary function with its arguments flipped. `f(a, b)` becomes `f'(b, a)` */
  export const flip =
    <A, B, C>(f: (a: A, b: B) => C) =>
    (b: B, a: A) =>
      f(a, b);

  /**
   * Constructs a new function `f'(a, b)` which does the same as calling `f(g(a), b)`.
   * It applies `g` to its left argument before running `f`.
   *
   * Transforms the left input before applying it to the target function.
   *
   * Use Case:
   * ```
   *  const checkAge = Fn.overLeft(Fn.comp.geq, p => p.age);
   *  const isOver18 = checkAge(person, 18);
   * ```
   */
  export const overLeft =
    <A, B, C, D>(f: (c: C, b: B) => D, g: (a: A) => C) =>
    (a: A, b: B) =>
      f(g(a), b);

  /**
   * Constructs a new function `f'(a, b)` which does the same as calling `f(a, g(b))`.
   * It applies `g` to its right argument before running `f`.
   *
   * Exactly the same as `overLeft`, except it applies the transformation on the right argument instead.
   */
  export const overRight =
    <A, B, C, D>(f: (a: A, c: C) => D, g: (b: B) => C) =>
    (a: A, b: B) =>
      f(a, g(b));

  /**
   * Constructs a new function `f'(a, b)` which does the same as calling `f(g(a), g(b))`.
   * It applies `g` to both arguments before running `f`.
   * Essentially the opposite of `atop`.
   *
   * Use Case
   * ```
   * const compareAge = Fn.over(Fn.comp.cmp, x => x.age);
   * const result = compareAge(luke, leia);
   * ```
   */
  export const over =
    <AB, C, D>(f: (c1: C, c2: C) => D, g: (ab: AB) => C) =>
    (a: AB, b: AB) =>
      f(g(a), g(b));

  /**
   * Constructs a new function `f'(a, b)` which does the same as calling `g(f(a, b))`.
   * It applies `a` and `b` to `f` before calling `g`.
   * Essentially the opposite of `over`.
   */
  export const atop =
    <A, B, C, D>(f: (a: A, b: B) => C, g: (c: C) => D) =>
    (a: A, b: B) =>
      g(f(a, b));

  /**
   * Creates a new function `f'(a)` which does the same as running `f(g(a), h(a))`.
   * It runs `a` through `g` and `h` before running the results through `f`.
   */
  export const fork1 =
    <A, B, C, D>(f: (b: B, c: C) => D, g: (a: A) => B, h: (a: A) => C) =>
    (a: A) =>
      f(g(a), h(a));

  export const compose = _.flow;

  /**
   * Creates a new function `f'(a, b)` which does the same as running `f(g(a, b), h(a, b))`.
   * It runs `a` and `b` through `g` and `h` and feeds the results to `f`.
   */
  export const fork2 =
    <A, B, C, D, E>(
      f: (c: C, d: D) => E,
      g: (a: A, b: B) => C,
      h: (a: A, b: B) => D,
    ) =>
    (a: A, b: B) =>
      f(g(a, b), h(a, b));

  // a lot of the more advanced functions require binary functions of the form foo(a, b).
  // None of the built-in binary operators follow this scheme.
  export namespace num {
    export const neg = (a: number) => -a;
    export const add = (a: number, b: number) => a + b;
    export const sub = (a: number, b: number) => a - b;
    export const mul = (a: number, b: number) => a * b;
    export const div = (a: number, b: number) => a / b;
  }

  export namespace bool {
    export const not = (a: boolean) => !a;
    export const and = (a: boolean, b: boolean) => a && b;
    export const or = (a: boolean, b: boolean) => a || b;
  }

  export namespace comp {
    export const lt = <T>(a: T, b: T) => a < b;
    export const gt = <T>(a: T, b: T) => a > b;
    export const lte = <T>(a: T, b: T) => a <= b;
    export const leq = lte;
    export const gte = <T>(a: T, b: T) => a > b;
    export const geq = gte;

    export const eq = <T>(a: T, b: T) => a === b;
    export const neq = <T>(a: T, b: T) => a !== b;

    export const cmp = <T>(a: T, b: T) => (a > b ? 1 : a < b ? -1 : 0);
  }

  export namespace bin {
    export const not = (a: number) => ~a;
    export const and = (a: number, b: number) => a & b;
    export const or = (a: number, b: number) => a | b;
  }

  export namespace str {
    export const cat = (a: string, b: string) => a + b;
  }

  export namespace obj {
    export const prop = (a: string) => (b: object) => b[a];
  }
}

export default Fn;
