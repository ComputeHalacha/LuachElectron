import { ipcRenderer } from 'electron';
import fs from 'fs';
import { tryToGuessLocation } from './JCal/Locations';
import DataUtils from './Data/DataUtils';
import RemoteBackup from './RemoteBackup';

/**
 * @returns {{IS_MAC:boolean, VALID_PIN:RegExp,APPDATA_FOLDER:string,INITIAL_DB_PATH:string,DEFAULT_DB_PATH:string }}
 */
export function getGlobals(): {
  IS_MAC: boolean;
  VALID_PIN: RegExp;
  APPDATA_FOLDER: string;
  INITIAL_DB_PATH: string;
  DEFAULT_DB_PATH: string;
} {
  return ipcRenderer.sendSync('getGlobals');
}

export async function confirm(message: string, title: string) {
  return ipcRenderer.sendSync('messageBox', {
    type: 'question',
    buttons: ['Yes', 'No'],
    cancelId: 1,
    title,
    message
  });
}
export async function inform(message: string, title: string) {
  return ipcRenderer.sendSync('messageBox', {
    type: 'info',
    title,
    message
  });
}

/**
 * Returns true if "thing" is either a string primitive or String object.
 * @param {unknown} thing
 */
export function isString(thing: unknown) {
  return typeof thing === 'string' || thing instanceof String;
}
/**
 * Returns true if "thing" is either a number primitive or a Number object.
 * @param {unknown} thing
 */
export function isNumber(thing: unknown) {
  return typeof thing === 'number' || thing instanceof Number;
}
/**
 * Returns true if "thing" is a Date object containing a valid date.
 * @param {unknown} thing
 */
export function isValidDate(thing: unknown) {
  return thing && thing instanceof Date && !Number.isNaN(thing.valueOf());
}
/** Returns whether or not the given, array, string, or argument list contains the given item or substring.
 *
 * This function is awfully similar to Array.includes, but has the added plus of accepting any number or type of arguments. */
export function has(o: unknown, ...arr: Array<unknown>) {
  if (arr.length === 1 && (Array.isArray(arr[0]) || isString(arr[0]))) {
    return (arr[0] as Array<unknown>).includes(o);
  }
  return arr.includes(o);
}
/**
 * Returns true only if the given value is null, undefined or NaN.
 * @param {*} val
 */
export function isNullish(val: unknown) {
  return typeof val === 'undefined' || val === null || Number.isNaN(val);
}

/** Returns the first value unless it is undefined, null or NaN.
 *
 * This is very useful for boolean, string and integer parameters
 * where we want to keep false, "" and 0 if they were supplied.
 *
 * Similar purpose to default parameters with the difference being that this function will return
 * the second value if the first is NaN or null, while default params will give give you the NaN or the null.
 */
export function setDefault(paramValue: unknown, defValue: unknown) {
  return isNullish(paramValue) ? defValue : paramValue;
}

/**
 * Returns true only if the given value is false, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrFalse(val: unknown) {
  return isNullish(val) || val === false;
}
/**
 * Returns true only if the given value is an empty string, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrEmpty(val: unknown) {
  return isNullish(val) || val === '';
}
/**
 * Returns true only if the given value is a string with no non-whitespace characters,
 * null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrWhitespace(val: unknown) {
  return isNullish(val) || (isString(val) && !(val as string).trim());
}
/**
 * Returns true only if the given value is 0, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrZero(val: unknown) {
  return isNullish(val) || val === 0;
}
/**
 * Returns an array containing a range of integers.
 * @param {Number} [start] The number to start at. The start number is included in the results.
 * If only one argument is supplied, start will be set to 1.
 * @param {Number} end The top end of the range.
 * Unlike Pythons range function, The end number is included in the results.
 * @returns {[Number]}
 */
export function range(start: number, end: number): Array<number> {
  if (!arguments.length) {
    throw new Error('The "end" value must be supplied');
  } else {
    let nEnd = end,
      nStart = start;
    if (arguments.length < 2 || isNullish(nStart)) {
      nEnd = nStart;
      nStart = 1;
    }
    return Array.from({ length: nEnd - nStart + 1 }, (_v, i) => nStart + i);
  }
}
export function getRandomString(len: number): string {
  return Array(len + 1)
    .join(`${Math.random().toString(36)}00000000000000000`.slice(2, 18))
    .slice(0, len);
}

export function isDev() {
  return (
    process.env.NODE_ENV === 'development' || process.env.E2E_BUILD === 'true'
  );
}
/**
 * Log message to console
 * @param {*} txt
 */
export function log(txt: string, ...other: Array<unknown>) {
  if (isDev()) {
    console.log(txt, ...other);
  }
}
/**
 * Warn message to console
 * @param {*} txt
 */
export function warn(txt: string, ...other: Array<unknown>) {
  if (isDev()) {
    console.warn(txt, ...other);
  }
}
/**
 * Error message to console
 * @param {*} txt
 */
export function error(txt: string, ...other: Array<unknown>) {
  if (isDev()) {
    console.error(txt, ...other);
  }
}

/**
 * Get a random number of the specified length.
 * @param {Number} length
 */
export function getRandomNumber(length: number): number {
  return Math.floor(
    10 ** (length - 1) + Math.random() * (9 * 10 ** (length - 1))
  );
}

/**
 * Gets just the filename without the path or extension.
 * Returns "test" when supplied with ".../assets/include/blah/folder/test.extension"
 * @param {String} filePath
 */
export function getFileName(filePath: string) {
  return filePath ? filePath.replace(/.+\/(.+)\..+/, '$1') : null;
}

export function fileExists(filePath: string) {
  return fs.existsSync(filePath);
}

export function getNewDatabaseName() {
  const d = new Date();
  return `${d.getDate()}-${d.getMonth()}-${d.getFullYear()}_${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}.sqlite`;
}

/**
 * Returns a deep clone of any object - note does not clone functions.
 * @param {Object} obj any object
 */
export function deepClone(obj: Object): Object {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Scroll to an item
 * @param {HTMLElement} item
 */
export function scrollTo(item: HTMLElement) {
  item.scrollIntoView({
    behavior: 'smooth'
  });
}

export async function initFirstRun() {
  log('GeneralUtils.initFirstRun(): IsFirstRun is true.');
  DataUtils.assureAppDataFolderExists();

  /** *********************************************************************
   * If this is the first time the app was run after a fresh installation,
   * we change the default location to a guess based
   * on the system time zone or else Lakewood NJ.
   *********************************************************************** */
  const newLocation = await tryToGuessLocation();
  log(
    `GeneralUtils.initFirstRun(): Guessed location is ${newLocation &&
      newLocation.Name}.`
  );
  await DataUtils.SetCurrentLocationOnDatabase(newLocation);
  log(`Location has been set to: ${newLocation.Name}`);
  // Create a remote backup account.
  if (await RemoteBackup.createFreshUserNewAccount()) {
    log(
      'GeneralUtils.initFirstRun(): A new remote account has been created with a random username and password'
    );
  }
}
