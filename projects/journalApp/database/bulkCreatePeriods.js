const { DateTime } = require("luxon");

const getNow = (timeZone = "America/Chicago") => DateTime.now().setZone(timeZone);

const getYearTimespans = (userTimeZone = "America/Chicago") => {
  const now = getNow(userTimeZone);
  const currentYear = now.year;

  const periodList = [];

  // Get all weeks from the start to the end of the year
  let weekStart = DateTime.local(currentYear).startOf("week").set({ hour: 0, minute: 0, second: 0 });
  let weekEnd = weekStart.endOf("week").set({ hour: 23, minute: 59, second: 59 });

  sequenceIndex = {
    week: 0,
    month: 0,
    year: 0
  }

  while (weekStart.year === currentYear) {
    periodList.push({
      type: "week",
      sequenceId: sequenceIndex.week,
      periodStartDate: weekStart.toJSDate(),
      periodEndDate: weekEnd.toJSDate(),
    });

    // Move to the next week
    weekStart = weekStart.plus({ weeks: 1 }).startOf("week").set({ hour: 0, minute: 0, second: 0 });
    weekEnd = weekStart.endOf("week").set({ hour: 23, minute: 59, second: 59 });

    sequenceIndex.week++;
  }

  // Get all months from the start to the end of the year
  let monthStart = DateTime.local(currentYear).startOf("month").set({ hour: 0, minute: 0, second: 0 });
  let monthEnd = monthStart.endOf("month").set({ hour: 23, minute: 59, second: 59 });

  while (monthStart.year === currentYear) {
    periodList.push({
      type: "month",
      sequenceId: sequenceIndex.month,
      periodStartDate: monthStart.toJSDate(),
      periodEndDate: monthEnd.toJSDate(),
    });

    // Move to the next month
    monthStart = monthStart.plus({ months: 1 }).startOf("month").set({ hour: 0, minute: 0, second: 0 });
    monthEnd = monthStart.endOf("month").set({ hour: 23, minute: 59, second: 59 });

    sequenceIndex.month++;
  }

  const yearStart = DateTime.local(currentYear).startOf("year").set({ hour: 0, minute: 0, second: 0 });
  const yearEnd = DateTime.local(currentYear).endOf("year").set({ hour: 23, minute: 59, second: 59 });

  periodList.push({
    type: "year",
    sequenceId: sequenceIndex.year,
    periodStartDate: yearStart.toJSDate(),
    periodEndDate: yearEnd.toJSDate(),
  });

  return periodList;
};


module.exports = { getYearTimespans };