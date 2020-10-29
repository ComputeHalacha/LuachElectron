import jDate from './JCal/jDate';
import Utils from './JCal/Utils';
import { UserOccasion } from './JCal/UserOccasion';
import { NightDay } from './Chashavshavon/Onah';

/**
 * Represents a single Jewish or Secular Month
 * Is used to generate a calendar month view.
 */
export default class Month {
  /**
   * @param {jDate | Date} date
   * @param {AppData} appData
   */
  constructor(date, appData) {
    this.isJdate = date instanceof jDate;
    this.appData = appData;

    // Set the date to the first of the month.
    if (this.isJdate) {
      this.date = new jDate(date.Year, date.Month, 1);
    } else if (date.getDate() === 1) {
      this.date = date;
    } else {
      this.date = new Date(date.getFullYear(), date.getMonth(), 1);
    }
    this.getSingleDay = this.getSingleDay.bind(this);
  }

  static toString(weeks, isJdate) {
    let txt = '';
    const firstDay = Month.getFirstDay(weeks);
    const firstJdate = firstDay.jdate;
    const firstSdate = firstDay.sdate;
    const lastWeek = weeks[weeks.length - 1];
    const lastDay = lastWeek[6] || lastWeek[lastWeek.findIndex(d => !d) - 1];
    const lastJdate = lastDay.jdate;
    const lastSdate = lastDay.sdate;
    if (isJdate) {
      txt = `${
        Utils.jMonthsEng[firstJdate.Month]
      } ${firstJdate.Year.toString()} / ${
        Utils.sMonthsEng[firstSdate.getMonth()]
      }${
        firstSdate.getMonth() !== lastSdate.getMonth()
          ? ` - ${Utils.sMonthsEng[lastSdate.getMonth()]}`
          : ''
      } ${lastSdate.getFullYear().toString()}`;
    } else {
      txt = `${
        Utils.sMonthsEng[firstSdate.getMonth()]
      } ${lastSdate.getFullYear().toString()} / ${
        Utils.jMonthsEng[firstJdate.Month]
      } ${
        firstJdate.Month !== lastJdate.Month
          ? ` - ${Utils.jMonthsEng[lastJdate.Month]}`
          : ''
      } ${lastJdate.Year.toString()}`;
    }
    return txt;
  }

  static getFirstDay(weeks) {
    const firstWeek = weeks[0];
    return firstWeek[firstWeek.findIndex(d => d)];
  }

  /**
   * Gets a 2 dimensional array for all the days in the month grouped by week.
   * Format is [weeks][days] where days are each an object:
   * { jdate,
   *  sdate,
   *  hasEntryNight,
   *  hasEntryDay,
   *  hasProbNight,
   *  hasProbDay,
   *  isHefsekDay,
   *  taharaEvents,
   *  hasEvent }
   */
  getAllDays() {
    return this.isJdate ? this.getAllDaysJdate() : this.getAllDaysSdate();
  }

  getSingleDay(ambiDate) {
    const jdate =
      (ambiDate instanceof jDate && ambiDate) || new jDate(ambiDate);
    const sdate = (ambiDate instanceof Date && ambiDate) || ambiDate.getDate();
    const hasEntryNight = this.appData.EntryList.list.some(
      e => Utils.isSameJdate(e.date, jdate) && e.nightDay === NightDay.Night
    );
    const hasProbNight = this.appData.ProblemOnahs.some(
      po => Utils.isSameJdate(po.jdate, jdate) && po.nightDay === NightDay.Night
    );
    const hasEntryDay = this.appData.EntryList.list.some(
      e => Utils.isSameJdate(e.date, jdate) && e.nightDay === NightDay.Day
    );
    const hasProbDay = this.appData.ProblemOnahs.some(
      po => Utils.isSameJdate(po.jdate, jdate) && po.nightDay === NightDay.Day
    );
    const isHefsekDay =
      this.appData.EntryList.list.length > 0 &&
      Utils.isSameJdate(jdate, this.appData.EntryList.lastEntry().hefsekDate);
    const taharaEvents = this.appData.TaharaEvents.filter(te =>
      Utils.isSameJdate(jdate, te.jdate)
    );
    const event =
      this.appData.UserOccasions.length > 0 &&
      UserOccasion.getOccasionsForDate(jdate, this.appData.UserOccasions)[0];
    return {
      jdate,
      sdate,
      hasEntryNight,
      hasEntryDay,
      hasProbNight,
      hasProbDay,
      isHefsekDay,
      taharaEvents,
      event
    };
  }

  getAllDaysJdate() {
    const daysInMonth = jDate.daysJMonth(this.date.Year, this.date.Month);
    const weeks = [new Array(7).fill(null)];
    for (let day = 1; day <= daysInMonth; day++) {
      const jdate = new jDate(this.date.Year, this.date.Month, day);
      const dow = jdate.DayOfWeek;
      weeks[weeks.length - 1][dow] = this.getSingleDay(jdate);
      if (dow === 6 && day < daysInMonth) {
        // We will need a new week for the following day.
        weeks.push(Array(7).fill(null));
      }
    }
    return weeks;
  }

  getAllDaysSdate() {
    const weeks = [Array(7).fill(null)];
    const month = this.date.getMonth();
    for (
      let sdate = new Date(this.date.valueOf());
      sdate.getMonth() === month;
      sdate.setDate(sdate.getDate() + 1)
    ) {
      const dow = sdate.getDay();
      weeks[weeks.length - 1][dow] = this.getSingleDay(new Date(sdate));
      if (dow === 6) {
        // We will need a new week for the following day.
        weeks.push(Array(7).fill(null));
      }
    }
    // If the month ended with a shabbos, the last added week will be empty.
    if (!weeks[weeks.length - 1].some(day => day)) {
      weeks.pop();
    }
    return weeks;
  }

  get prevYear() {
    if (this.isJdate) {
      return new Month(this.date.addYears(-1), this.appData);
    }
    return new Month(
      new Date(this.date.getFullYear() - 1, this.date.getMonth(), 1),
      this.appData
    );
  }

  get nextYear() {
    if (this.isJdate) {
      return new Month(this.date.addYears(1), this.appData);
    }
    return new Month(
      new Date(this.date.getFullYear() + 1, this.date.getMonth(), 1),
      this.appData
    );
  }

  get prevMonth() {
    if (this.isJdate) {
      return new Month(this.date.addMonths(-1), this.appData);
    }
    return new Month(
      new Date(this.date.getFullYear(), this.date.getMonth() - 1, 1),
      this.appData
    );
  }

  get nextMonth() {
    if (this.isJdate) {
      return new Month(this.date.addMonths(1), this.appData);
    }
    return new Month(
      new Date(this.date.getFullYear(), this.date.getMonth() + 1, 1),
      this.appData
    );
  }
}