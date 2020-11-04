/* eslint-disable no-underscore-dangle */

import { log, error, getGlobals } from '../GeneralUtils';

const globals = getGlobals();
const AllKeys = [
  'REQUIRE_PIN',
  'PIN',
  'REMOTE_USERNAME',
  'REMOTE_PASSWORD',
  'DATABASE_PATH'
];

/**
 * @type {{requirePin:boolean, PIN:String, remoteUserName:String, remotePassword:String, databasePath:String }}
 */
export default class LocalStorage {
  constructor() {
    this._requirePin = false;
    this._PIN = null;
    this._remoteUserName = null;
    this._remotePassword = null;
    this._databasePath = globals.DEFAULT_DB_PATH;
  }

  get requirePin() {
    return !!this._requirePin;
  }

  set requirePin(val) {
    LocalStorage.setLocalStorageValue('REQUIRE_PIN', !!val);
    this._requirePin = val;
  }

  get PIN() {
    return this._PIN;
  }

  set PIN(val) {
    LocalStorage.setLocalStorageValue('PIN', val);
    this._PIN = val;
  }

  get remoteUserName() {
    return this._remoteUserName;
  }

  set remoteUserName(val) {
    LocalStorage.setLocalStorageValue('REMOTE_USERNAME', val);
    this._remoteUserName = val;
  }

  get remotePassword() {
    return this._remotePassword;
  }

  set remotePassword(val) {
    LocalStorage.setLocalStorageValue('REMOTE_PASSWORD', val || '');
    this._remotePassword = val;
  }

  get databasePath() {
    return this._databasePath || globals.DEFAULT_DB_PATH;
  }

  set databasePath(val) {
    LocalStorage.setLocalStorageValue('DATABASE_PATH', val || '');
    this._databasePath = val;
  }

  /**
   * Loads the current objects properties from localStorage
   */
  static async loadAll() {
    return new Promise((resolve, reject) => {
      try {
        const ls = new LocalStorage();
        AllKeys.forEach(key => {
          const value = localStorage.getItem(key);
          if (value !== null) {
            switch (key) {
              case 'REQUIRE_PIN':
                ls._requirePin = value && Boolean(JSON.parse(value));
                break;
              case 'PIN':
                ls._PIN = JSON.parse(value);
                break;
              case 'REMOTE_USERNAME':
                ls._remoteUserName = JSON.parse(value);
                break;
              case 'REMOTE_PASSWORD':
                ls._remotePassword = JSON.parse(value);
                break;
              case 'DATABASE_PATH':
                ls._databasePath = JSON.parse(value);
                break;
              default:
                break;
            }
          }
        });
        resolve(ls);
      } catch (er) {
        reject(er);
      }
    });
  }

  static setLocalStorageValue(name, value) {
    try {
      if (value !== null && typeof value !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value));
        log(`Set ${name} to ${value} in storage data`);
      } // Undefined or null value - if we find it in the storage, it will be removed
      else {
        localStorage.removeItem(name);
        log(`Removed ${name} from in storage data`);
      }
    } catch (e) {
      error(`Failed to set ${name} to ${value} in storage data:`, e);
    }
  }

  static wasInitialized() {
    return localStorage.getItem(AllKeys[0]) !== null;
  }

  static wasDatabasepathInitialized() {
    return !!localStorage.getItem('DATABASE_PATH');
  }

  static initialize(requirePin, PIN) {
    if (!this.wasInitialized()) {
      LocalStorage.setLocalStorageValue('REQUIRE_PIN', !!requirePin);
      LocalStorage.setLocalStorageValue('PIN', PIN);
    }
    if (!this.wasDatabasepathInitialized()) {
      // This is the inbuilt original database
      LocalStorage.setLocalStorageValue(
        'DATABASE_PATH',
        globals.DEFAULT_DB_PATH
      );
    }
  }
}
