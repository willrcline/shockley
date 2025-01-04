const { DateTime } = require("luxon");

const getNow = (timeZone = "America/Chicago") =>
  DateTime.now().setZone(timeZone);

const getYearTimespans = (year, userTimeZone = "America/Chicago") => {
  const periodYear = year || getNow(userTimeZone).year; // Default to the current year if no year is provided
  const periodList = [];

  // Initialize sequence indices
  const sequenceIndex = {
    week: 0,
    month: 0,
    year: 0,
  };

  // Calculate all weeks for the year
  let weekStart = DateTime.local(periodYear, 1, 1)
    .set({ hour: 0, minute: 0, second: 0 })
    .setZone(userTimeZone);

  // Ensure weekStart aligns with the first Monday of the year
  if (weekStart.weekday !== 1) {
    weekStart = weekStart
      .startOf("week")
      .set({ hour: 0, minute: 0, second: 0 });
  }

  while (
    weekStart.year === periodYear ||
    weekStart.endOf("week").year === periodYear
  ) {
    const weekEnd = weekStart
      .endOf("week")
      .set({ hour: 23, minute: 59, second: 59 });

    periodList.push({
      type: "week",
      sequenceId: sequenceIndex.week,
      periodStartDate: weekStart.toJSDate(),
      periodEndDate: weekEnd.toJSDate(),
    });

    // Move to the next week
    weekStart = weekStart
      .plus({ weeks: 1 })
      .set({ hour: 0, minute: 0, second: 0 });
    sequenceIndex.week++;
  }

  // Calculate all months for the year
  let monthStart = DateTime.local(periodYear, 1, 1)
    .startOf("month")
    .set({ hour: 0, minute: 0, second: 0 })
    .setZone(userTimeZone);

  while (monthStart.year === periodYear) {
    const monthEnd = monthStart
      .endOf("month")
      .set({ hour: 23, minute: 59, second: 59 });

    periodList.push({
      type: "month",
      sequenceId: sequenceIndex.month,
      periodStartDate: monthStart.toJSDate(),
      periodEndDate: monthEnd.toJSDate(),
    });

    // Move to the next month
    monthStart = monthStart
      .plus({ months: 1 })
      .set({ hour: 0, minute: 0, second: 0 });
    sequenceIndex.month++;
  }

  // Add the year period
  const yearStart = DateTime.local(periodYear, 1, 1)
    .startOf("year")
    .set({ hour: 0, minute: 0, second: 0 })
    .setZone(userTimeZone);

  const yearEnd = yearStart
    .endOf("year")
    .set({ hour: 23, minute: 59, second: 59 });

  periodList.push({
    type: "year",
    sequenceId: sequenceIndex.year,
    periodStartDate: yearStart.toJSDate(),
    periodEndDate: yearEnd.toJSDate(),
  });

  return periodList;
};

module.exports = { getYearTimespans };
