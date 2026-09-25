// debounce — delays the call until `wait` ms have passed with no further calls.
// On the job board this drives the search box: type "seni", "senio", "senior" and only
// the last one hits the network. Asked in interviews more than any other utility.

export interface Debounced<Args extends unknown[]> {
  (...args: Args): void
  /** Drop a pending call. */
  cancel(): void
}

export function debounce<Args extends unknown[]>(
  fn: (...args: Args) => void,
  wait: number,
): Debounced<Args> {
  throw new Error('Not implemented')
}
