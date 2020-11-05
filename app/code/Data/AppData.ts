import { useContext } from 'react';
import DataUtils from './DataUtils';
import Settings from '../Settings';
import Entry from '../Chashavshavon/Entry';
import { Kavuah } from '../Chashavshavon/Kavuah';
import EntryList from '../Chashavshavon/EntryList';
import { UserOccasion } from '../JCal/UserOccasion';
import ProblemOnah from '../Chashavshavon/ProblemOnah';
import { TaharaEvent } from '../Chashavshavon/TaharaEvent';
import {
  resetDayOnahReminders,
  resetNightOnahReminders,
  removeAllDayOnahReminders,
  removeAllNightOnahReminders
} from '../Notifications';
import { error, warn, isNullishOrFalse } from '../GeneralUtils';
import AppDataContext from '../../components/AppDataContext';

/**
 * List of fields that have been added after the initial app launch.
 * Any that do not yet exist, will be added to the db schema during initial loading.
 * Optionally sets an async callback to run after the field has been added.
 */
const addedFields: string[] = [];

/**
 * An single object that contains all the application data.
 * Ideally, there should only be a single global instance of this class.
 */
export default class AppData {
  Settings: Settings;
  UserOccasions: UserOccasion[];
  EntryList: EntryList;
  KavuahList: Kavuah[];
  ProblemOnahs: ProblemOnah[];
  TaharaEvents: TaharaEvent[];
  /**
   * @param {Settings} settings
   * @param {[UserOccasion]} occasions
   * @param {EntryList} entryList
   * @param {[Kavuah]} kavuahList
   * @param {[ProblemOnah]} problemOnahs
   * @param {[TaharaEvent]} taharaEvents
   */
  constructor(
    settings: Settings,
    occasions: UserOccasion[],
    entryList: EntryList,
    kavuahList: Kavuah[],
    problemOnahs: ProblemOnah[],
    taharaEvents: TaharaEvent[]
  ) {
    this.Settings = settings || new Settings({});
    this.UserOccasions = occasions || [];
    this.EntryList = entryList || new EntryList();
    this.KavuahList = kavuahList || [];
    this.ProblemOnahs = problemOnahs || [];
    this.TaharaEvents = taharaEvents || [];
  }

  /**
   *  Calculates all the Entry Haflagas and Flagged Dates for this appData instance.
   */
  updateProbs() {
    this.EntryList.calculateHaflagas();
    let probs: ProblemOnah[] = [];
    if (this.EntryList.list.length > 0) {
      probs = this.EntryList.getProblemOnahs(this.KavuahList, this.Settings);
    }
    this.ProblemOnahs = probs;
  }

  /**
   * Returns the appData object.
   * The first time this function is called, the global object is filled with the data from the local database file.
   */
  static async getAppData() {
    const { appData, setAppData } = useContext(AppDataContext);
    return { appData, setAppData };
  }

  /**
   * Adds or removes the given item to the appropriate list in the global appData object.
   * The Entry Haflagas and Flagged Dates are then recalculated for the global appData object.
   * @param {Entry | Kavuah} item
   * @param {Boolean} remove
   */
  static updateGlobalProbs(item?: Entry | Kavuah, remove?: Boolean) {
    AppData.getAppData().then(({ appData, setAppData }) => {
      if (item) {
        if (!remove) {
          if (item instanceof Entry) {
            appData.EntryList.add(item);
          } else if (item instanceof Kavuah) {
            appData.KavuahList.push(item);
          }
        } else if (item instanceof Entry) {
          appData.EntryList.remove(item);
        } else if (item instanceof Kavuah) {
          const index = appData.KavuahList.indexOf(item);
          if (index > -1) {
            appData.KavuahList.splice(index, 1);
          }
        }
      }
      appData.updateProbs(appData);

      if (isNullishOrFalse(appData.Settings.remindDayOnahHour)) {
        removeAllDayOnahReminders();
      } else {
        resetDayOnahReminders(appData);
      }
      if (isNullishOrFalse(appData.Settings.remindNightOnahHour)) {
        removeAllNightOnahReminders();
      } else {
        resetNightOnahReminders(appData);
      }
      setAppData(appData);
    });
  }

  /**
   * Update the schema of the local database file.
   * Any new fields that do not yet exist, will be added to the db schema.
   */
  static async upgradeDatabase() {
    // First get a list of tables that may need updating.
    const tablesToChange: [] = [];
    for (const af of addedFields) {
      if (!tablesToChange.includes(af.table)) {
        tablesToChange.push(af.table);
      }
    }
    for (const tbl of tablesToChange) {
      // Get the new fields for this table.
      const newFields = addedFields.filter(af => af.table === tbl);
      const fields = await DataUtils.GetTableFields(tbl);

      for (const nf of newFields) {
        if (!fields.some(f => f.name === nf.name)) {
          // Add any new fields that were added after the last update.
          await DataUtils.AddTableField(nf);
          // If there was a callback supplied.
          if (nf.afterAddCallback) {
            await nf.afterAddCallback();
          }
        }
      }
    }
  }

  /**
   * Returns an appData instance containing all the user data from the local database file.
   */
  static async fromDatabase() {
    // Before getting data from database, make sure that the local database schema is up to date.
    //await AppData.upgradeDatabase();

    const settings = await DataUtils.SettingsFromDatabase().catch(err => {
      warn('Error running SettingsFromDatabase.');
      error(err);
    });
    const occasions = await DataUtils.GetAllUserOccasions().catch(err => {
      warn('Error running GetAllUserOccasions.');
      error(err);
    });
    const entryList = await DataUtils.EntryListFromDatabase().catch(err => {
      warn('Error running EntryListFromDatabase.');
      error(err);
    });
    const kavuahList = await DataUtils.GetAllKavuahs(entryList).catch(err => {
      warn('Error running GetAllKavuahs.');
      error(err);
    });
    const taharaEvents = await DataUtils.GetAllTaharaEvents().catch(err => {
      warn('Error running GetAllTaharaEvents.');
      error(err);
    });

    // After getting all the data, the problem onahs are set.
    const problemOnahs = entryList.getProblemOnahs(kavuahList, settings);

    return new AppData(
      settings,
      occasions,
      entryList,
      kavuahList,
      problemOnahs,
      taharaEvents
    );
  }
}
