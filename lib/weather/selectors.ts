// getRelativeFuturePeriod gets the identifier for the future period relative to
// a given date (now by default), e.g. either "Tongiht" or "Tomorrow". If the
// time is after 5am or before 6pm "Tonight" is chosen as the next future period,
// otherwise "Tomorrow" is chosen. Note that this means even the hours between
// 12am and 4am are considered to be "today".
export const getRelativeFuturePeriod = (curDate: Date = new Date()): 'Tonight'|'Tomorrow' => {
  const time = curDate.getHours();

  if (time > 5 && time < 18) { return 'Tonight'; }
  return 'Tomorrow';
};
