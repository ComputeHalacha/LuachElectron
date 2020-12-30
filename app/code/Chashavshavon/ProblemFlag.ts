import { NightDay, Onah } from './Onah';
import Utils from '../JCal/Utils';
import jDate from './../JCal/jDate';
/**
 * Represents a single flag for a single Onah.
 * Each Onah can have multiple flags.
 */
export default class ProblemFlag {
  jdate: jDate;
  nightDay: NightDay;
  description: string;
  /**
   * @param {jDate} jdate
   * @param {NightDay} nightDay
   * @param {String} description
   */
  constructor(jdate: jDate, nightDay: NightDay, description: string) {
    if (!jdate) {
      throw 'jdate must be supplied.';
    }
    if (!nightDay) {
      throw 'nightDay must be supplied.';
    }
    if (!description) {
      throw 'description must be supplied.';
    }
    this.jdate = jdate;
    this.nightDay = nightDay;
    this.description = description;
  }

  get onah() {
    return new Onah(this.jdate, this.nightDay);
  }

  /**
   * Tests to see if the given ProblemFlag matches this one.
   * @param {ProblemFlag} prob
   */
  isSameProb(prob: ProblemFlagn) {
    return (
      Utils.isSameJdate(this.jdate, prob.jdate) &&
      this.nightDay === prob.nightDay &&
      this.description === prob.description
    );
  }
}
