//get a date from a string 2022-06-02
function dateFromStr(str) {
  const yStr = str.substring(0, 4);
  const mStr = str.substring(5, 7);
  const dStr = str.substring(8, 10);
  const y = parseInt(yStr);
  const m = parseInt(mStr) - 1;
  const d = parseInt(dStr);
  return new Date(Date.UTC(y, m, d, 0, 0, 0) + MILLISECONDS_IN_DAY);
}

//convert a string '2022-06-11' or 2022-06-11THH:MM
//to weekday, month day Thu, Jun 4
export function dateStrShort(str) {
  let date = dateFromStr(str);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

//convert a string '2022-06-11' or 2022-06-11THH:MM
//to weekday, month day Thursday, June 4
export function dateStrLong(str) {
  let date = dateFromStr(str);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

//extract a time sting HH:MM from a data string
//DD-MM-YYTHH:SS
export function timeStr(str) {
  return str.substring(11);
}

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

//converts a date into a date string
function dateStrFromDate(date) {
  const year = date.getFullYear().toString();
  const monthNum = date.getMonth() + 1;
  let month = monthNum.toString();
  if (month.length === 1) month = "0" + month;
  let day = date.getDate().toString();
  if (day.length === 1) day = "0" + day;
  return year + "-" + month + "-" + day;
}

//From two DateTime strings '2022-06-02T11:00'
//get an array of date strings '2022-06-03' from a start date to an end date
export function tripDates(startStr, endStr, withTime) {
  const startDate = dateFromStr(startStr);
  const startTime = startDate.getTime();
  const endDate = dateFromStr(endStr);
  const endTime = endDate.getTime();
  let dates = [];
  for (let i = startTime; i <= endTime; i = i + MILLISECONDS_IN_DAY) {
    let newDate = new Date(i);
    withTime
      ? dates.push(dateStrFromDate(newDate) + "T00:00")
      : dates.push(dateStrFromDate(newDate));
  }
  return dates;
}

/* let nonLeap = tripDates("2023-02-23T00:00", "2023-03-21T23:59", true);
let leap = tripDates("2024-02-23T00:00", "2024-03-21T23:59", true);
let cal = tripDates("2023-09-19T00:00", "2023-10-03T23:59", true);

console.group("Trip Dates");
console.log("😊😊 nonLeap.length", nonLeap.length);
console.log("😊😊 nonLeap", nonLeap);
console.log("😊😊 leap.length", leap.length);
console.log("😊😊 leap", leap);
console.log("😊😊 cal.length", cal.length);
console.log("😊😊 cal", cal);
console.groupEnd(); */

//From two DateTime strings '2022-06-02T11:00'
//get an array of date strings '2022-06-03' between two dates
//used by Room to make trip detail items for stayDates
export function stayDates(startStr, endStr, withTime) {
  const startDate = dateFromStr(startStr);
  const startTime = startDate.getTime();
  const endDate = dateFromStr(endStr);
  const endTime = endDate.getTime();
  let dates = [];
  for (
    let i = startTime + MILLISECONDS_IN_DAY;
    i < endTime;
    i = i + MILLISECONDS_IN_DAY
  ) {
    let newDate = new Date(i);
    withTime
      ? dates.push(dateStrFromDate(newDate) + "T00:00")
      : dates.push(dateStrFromDate(newDate));
  }
  return dates;
}

/* nonLeap = stayDates("2023-02-23T00:00", "2023-03-21T23:59", true);
leap = stayDates("2024-02-23T00:00", "2024-03-21T23:59", true);
cal = stayDates("2023-09-19T00:00", "2023-10-03T23:59", true);

console.group("Stay Dates");
console.log("😊😊 nonLeap.length", nonLeap.length);
console.log("😊😊 nonLeap", nonLeap);
console.log("😊😊 leap.length", leap.length);
console.log("😊😊 leap", leap);
console.log("😊😊 cal.length", cal.length);
console.log("😊😊 cal", cal);
console.groupEnd(); */

/********************************************/
/* //convert a date, time string '2022-06-02T11:00'
//to an integer 202206021100
function dateTimeStrToInt(str) {
  str = str.replaceAll('-', '');
  str = str.replaceAll('T', '');
  str = str.replaceAll(':', '');
  return parseInt(str);
} */

/* //convert an integer 202206021100
//to a date, time string '2022-06-02T11:00'
function intToDateTimeStr(int) {
  let str = int.toString();
  let newStr = str.slice(0, 4) + '-';
  newStr = newStr + str.slice(4, 6) + '-';
  newStr = newStr + str.slice(6, 8) + 'T';
  newStr = newStr + str.slice(8, 10) + ':';
  newStr = newStr + str.slice(10);
  return newStr;
} */

/* //convert a date string 2022-06-02
//to an integer 20220602
function dateStrToInt(str) {
  str = str.replaceAll('-', '');
  let dateStr = str.slice(0, 8);
  return parseInt(dateStr);
} */

/* //convert an integer 20220602
//to a date string '2022-06-02'
function intToDateStr(int) {
  let str = int.toString();
  let newStr = str.slice(0, 4) + '-';
  newStr = newStr + str.slice(4, 6) + '-';
  newStr = newStr + str.slice(6, 8);
  return newStr;
} */

/* //convert an integer 20220611
//to weekday, month day Thursday, June 4
//used by ItineraryPage to make trip day headers
function dowMonthDayFromInt(int, length) {
  let str = intToDateStr(int);
  let date = dateFromStr(str);
  return date.toLocaleDateString(undefined, {
    weekday: length,
    month: length,
    day: 'numeric',
  });
} */

/* //calculate the difference between two dates in days

function dateDiff(start, end) {
  const dStart = dateFromStr(start);
  const dEnd = dateFromStr(end);
  const diff = dEnd.getTime() - dStart.getTime();
  return diff / MILLISECONDS_IN_DAY;
} */
