import { DateTime } from "luxon";

export function toLocal(utcString: string) {
  const dtUTC = DateTime.fromISO(utcString, { zone: "utc" });
  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const dtLocal = dtUTC.setZone(userZone);

  return dtLocal;
}

// export function toEEST(date: string) {
//   const localTime = DateTime.fromISO(date);
//   const eestTime = localTime.setZone("Europe/Helsinki");

//   return eestTime.toISO();
// }

export function isSameHour(date1: Date, date2: Date) {
  console.log(date1, date2);
  return (
    date1.getFullYear() == date2.getFullYear() &&
    date1.getMonth() == date2.getMonth() &&
    date1.getDay() == date2.getDay() &&
    date1.getHours() == date2.getHours()
  );
}
