/**
 * Returns the current time in seconds plus the given number of seconds.
 * @param {number} sec - The number of seconds to add to the current time.
 * @returns The current time in seconds plus the given number of seconds.
 */
const unix = (sec: number) => Math.floor(Date.now() / 1000) + sec;

/**
 * Returns the current time in milliseconds plus the given number of seconds.
 * @param {number} sec - The number of seconds to add to the current time.
 * @returns The current time in milliseconds plus the given number of seconds.
 */
const milliseconds = (sec: number) => Date.now() + sec * 1000;

const time = {
  unix,
  milliseconds,
};

export default time;
