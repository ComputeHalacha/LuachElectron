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

export const KeyNames = Object.freeze({
  REQUIRE_PIN: 'REQUIRE_PIN',
  PIN: 'PIN',
  REMOTE_USERNAME: 'REMOTE_USERNAME',
  REMOTE_PASSWORD: 'REMOTE_PASSWORD',
  DATABASE_PATH: 'DATABASE_PATH'
});

/**
 * @type {{requirePin:boolean, PIN:String, remoteUserName:String, remotePassword:String, databasePath:String }}
 */
export default class LocalStorage {
  constructor() {
    this.requirePin = false;
    this.PIN = null;
    this.remoteUserName = null;
    this.remotePassword = null;
    this.databasePath = globals.DEFAULT_DB_PATH;
  }

  clone() {
    const ls = new LocalStorage();
    ls.requirePin = this.requirePin;
    ls.PIN = this.PIN;
    ls.remoteUserName = this.remoteUserName;
    ls.remotePassword = this.remotePassword;
    ls.databasePath = this.databasePath;
    return ls;
  }

  setRequirePin(val) {
    LocalStorage.setLocalStorageValue('REQUIRE_PIN', !!val);
    this.requirePin = val;
  }

  setPIN(val) {
    LocalStorage.setLocalStorageValue('PIN', val);
    this.PIN = val;
  }

  setRemoteUserName(val) {
    LocalStorage.setLocalStorageValue('REMOTE_USERNAME', val);
    this.remoteUserName = val;
  }

  setRemotePassword(val) {
    LocalStorage.setLocalStorageValue('REMOTE_PASSWORD', val || '');
    this.remotePassword = val;
  }

  setDatabasePath(val) {
    LocalStorage.setLocalStorageValue('DATABASE_PATH', val || '');
    this.databasePath = val;
  }

  saveAll() {
    AllKeys.forEach(key => {
      switch (key) {
        case 'REQUIRE_PIN':
          LocalStorage.setLocalStorageValue(key, !!this.requirePin);
          break;
        case 'PIN':
          LocalStorage.setLocalStorageValue(key, this.PIN);
          break;
        case 'REMOTE_USERNAME':
          LocalStorage.setLocalStorageValue(key, this.remoteUserName);
          break;
        case 'REMOTE_PASSWORD':
          LocalStorage.setLocalStorageValue(key, this.remotePassword || '');
          break;
        case 'DATABASE_PATH':
          LocalStorage.setLocalStorageValue(key, this.databasePath || '');
          break;
        default:
          break;
      }
    });
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
                ls.requirePin = value && Boolean(JSON.parse(value));
                break;
              case 'PIN':
                ls.PIN = JSON.parse(value);
                break;
              case 'REMOTE_USERNAME':
                ls.remoteUserName = JSON.parse(value);
                break;
              case 'REMOTE_PASSWORD':
                ls.remotePassword = JSON.parse(value);
                break;
              case 'DATABASE_PATH':
                ls.databasePath = JSON.parse(value);
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
