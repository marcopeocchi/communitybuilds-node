import { SearchStrategy } from "../types";

export function decouple(T: any): string {
  return (T as unknown) as string
}

/**
 * Since google sheets bumps classnames by 1 on every build/update
 * deconstruct the object and bump each classname by one
 * Classnames are defined as s[n] where n is a positive integer,
 * e.g. s79 is a class name. This function bumps s[n] to s[n+1],
 * e.g. s79 -> s80.
 * Then, finally returns the object
 * @param strategy generic search strategy object, either for Weapons or Artifacts
 * @param bumpAddend how many times the class should be bumped
 * @returns 
 */
export function bumpClassBy<T>(strategy: SearchStrategy<T>, bumpAddend: number): SearchStrategy<T> {
  if (bumpAddend === 0) {
    return strategy
  }
  const copy = { ...strategy }
  for (const key in strategy) {
    if (Object.prototype.hasOwnProperty.call(strategy, key)) {
      if (key !== 'img') {
        copy[key] = strategy[key]
          .replaceAll('td.s', '')
          .split(',')
          .map(val => String(Number(val) + bumpAddend))
          .reduce((curr, next) => `${curr}, td.s${next}`, 'td.s')
      }
    }
  }
  return copy
}