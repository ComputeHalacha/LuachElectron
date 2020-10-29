const GLOBALS = {};
const DeviceInfo = {};
const Platform = {};
const ToastAndroid = {};
const Alert = {};

/*
export const GLOBALS = Object.freeze({
  VERSION_NAME: DeviceInfo.getReadableVersion().replace(/(.+)\..+/, '$1'),
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  BUTTON_COLOR: Platform.OS === 'android' ? '#99b' : null,
  VALID_PIN: /^\d{4,}$/,
  DEFAULT_DB_PATH: '~data/luachAndroidDB.sqlite'
});
*/

export function popUpMessage(message, optionalTitle) {
  if (GLOBALS.IS_ANDROID) {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER
    );
  } else {
    Alert.alert(optionalTitle, message);
  }
}

export async function confirm(message, title) {
  return new Promise((resolve, reject) => {
    Alert.alert(title, message, [
      {
        text: 'No',
        onPress: () => reject(false),
        style: 'cancel'
      },
      {
        text: 'Yes',
        onPress: () => resolve(true)
      }
    ]);
  });
}
export async function inform(message, title) {
  return new Promise((resolve, reject) => {
    try {
      Alert.alert(title, message, [
        {
          text: 'OK',
          onPress: () => resolve(true)
        }
      ]);
    } catch (e) {
      reject(e.message);
    }
  });
}

/** Returns true if "thing" is either a string primitive or String object. */
export function isString(thing) {
  return typeof thing === 'string' || thing instanceof String;
}
/** Returns true if "thing" is either a number primitive or a Number object. */
export function isNumber(thing) {
  return typeof thing === 'number' || thing instanceof Number;
}
/** Returns true if "thing" is a Date object containing a valid date. */
export function isValidDate(thing) {
  return thing && thing instanceof Date && !isNaN(thing.valueOf());
}
/** Returns whether or not the given, array, string, or argument list contains the given item or substring.
 *
 * This function is awfully similar to Array.includes, but has the added plus of accepting any number or type of arguments. */
export function has(o, ...arr) {
  if (arr.length === 1 && (Array.isArray(arr[0]) || isString(arr[0]))) {
    return arr[0].includes(o);
  }
  return arr.includes(o);
}
/**
 * Returns true only if the given value is null, undefined or NaN.
 * @param {*} val
 */
export function isNullish(val) {
  return typeof val === 'undefined' || val === null || isNaN(val);
}

/** Returns the first value unless it is undefined, null or NaN.
 *
 * This is very useful for boolean, string and integer parameters
 * where we want to keep false, "" and 0 if they were supplied.
 *
 * Similar purpose to default parameters with the difference being that this function will return
 * the second value if the first is NaN or null, while default params will give give you the NaN or the null.
 */
export function setDefault(paramValue, defValue) {
  return isNullish(paramValue) ? defValue : paramValue;
}

/**
 * Returns true only if the given value is false, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrFalse(val) {
  return isNullish(val) || val === false;
}
/**
 * Returns true only if the given value is an empty string, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrEmpty(val) {
  return isNullish(val) || val === '';
}
/**
 * Returns true only if the given value is a string with no non-whitespace characters,
 * null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrWhitespace(val) {
  return isNullish(val) || (isString(val) && !val.trim());
}
/**
 * Returns true only if the given value is 0, null, undefined or NaN.
 * @param {*} val
 */
export function isNullishOrZero(val) {
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
export function range(start, end) {
  if (!arguments.length) {
    throw new Error('The "end" value must be supplied');
  } else {
    if (arguments.length < 2 || isNullish(start)) {
      end = start;
      start = 1;
    }
    return Array.from({ length: end - start + 1 }, (v, i) => start + i);
  }
}
export function getRandomString(len) {
  return Array(len + 1)
    .join(`${Math.random().toString(36)}00000000000000000`.slice(2, 18))
    .slice(0, len);
}
/**
 * Log message to console
 * @param {*} txt
 */
export function log(txt, ...other) {
  if (__DEV__) {
    console.log(txt, ...other);
  }
}
/**
 * Warn message to console
 * @param {*} txt
 */
export function warn(txt, ...other) {
  if (__DEV__) {
    console.warn(txt, ...other);
  }
}
/**
 * Error message to console
 * @param {*} txt
 */
export function error(txt, ...other) {
  if (__DEV__) {
    console.error(txt, ...other);
  }
}

/**
 * Tries to guess the users location from the set time zone name and current utcoffset.
 * Default is Lakewood NJ.
 */
export async function tryToGuessLocation() {
  /* const timeZoneName = DeviceInfo.getTimezone();
  const cityName = timeZoneName.replace(/.+\/(.+)/, '$1').replace('_', ' ');
  const foundList = await DataUtils.SearchLocations(cityName, true);

  log(`Device time zone is set to: ${timeZoneName}`);
  return foundList[0] || Location.getLakewood(); */
}

/**
 * Get a random number of the specified length.
 * @param {Number} length
 */
export function getRandomNumber(length) {
  return Math.floor(
    10 ** (length - 1) + Math.random() * (9 * 10 ** (length - 1))
  );
}

/**
 * Gets just the filename without the path or extension.
 * Returns "test" when supplied with ".../assets/include/blah/folder/test.extension"
 * @param {String} path
 */
export function getFileName(path) {
  return path ? path.replace(/.+\/(.+)\..+/, '$1') : null;
}