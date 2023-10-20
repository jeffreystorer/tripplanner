import { HashRouter } from "react-router-dom";

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

//get a timestamp from a string 2022-06-02

function timestampFromDateTimeStr(str) {
  const yStr = str.substring(0, 4);
  const mStr = str.substring(5, 7);
  const dStr = str.substring(8, 10);
  const tStr = timeStr(str);
  const hrmn = tStr.split(':');
  const y = parseInt(yStr);
  const m = parseInt(mStr) - 1;
  const d = parseInt(dStr);
  const hr = parseInt(hrmn[0]);
  const mn = parseInt(hrmn[1])
  let timestamp = Date.UTC(y, m, d, hr, mn, 0);
  return timestamp;
}
//get a date from a string 2022-06-02
function dateFromDateStr(str) {
  const yStr = str.substring(0, 4);
  const mStr = str.substring(5, 7);
  const dStr = str.substring(8, 10);
  const y = parseInt(yStr);
  const m = parseInt(mStr) - 1;
  const d = parseInt(dStr);
  let timestamp = Date.UTC(y, m, d, 0, 0, 0); // + MILLISECONDS_IN_DAY;
  const date = new Date(timestamp);

 /*  console.groupCollapsed('dateFromDateStr')
  console.log("str:", str)
  console.log("timestamp:", timestamp)
  console.log("dateStrFromTimestamp(timestamp)", dateStrFromTimestamp(timestamp))
  console.log("date:", date)
  console.log("date.valueOf():", date.valueOf())
  console.groupEnd() */

  return date;
}
//console.log("😊😊 dateFromDateStr('2022-06-02')",dateFromDateStr('2022-06-02') )


//get a date from a string 2022-06-02T:00
function dateFromDateTimeStr(str) {
  const yStr = str.substring(0, 4);
  const mStr = str.substring(5, 7);
  const dStr = str.substring(8, 10);
  const tStr = timeStr(str);
  const hrmn = tStr.split(':');
  const y = parseInt(yStr);
  const m = parseInt(mStr) - 1;
  const d = parseInt(dStr);
  const hr = parseInt(hrmn[0]);
  const mn = parseInt(hrmn[1])
  let timestamp = Date.UTC(y, m, d, hr, mn, 0); // + MILLISECONDS_IN_DAY;
  const date = new Date(timestamp);

 /*  console.groupCollapsed('dateFromDateTimeStr')
  console.log("str:", str)
  console.log("tStr", tStr)
  console.log("hrmn", hrmn)
  console.log("timestamp:", timestamp)
  console.log("dateStrFromTimestamp(timestamp)", dateStrFromTimestamp(timestamp))
  console.log("date:", date)
  console.log("date.valueOf():", date.valueOf())
  console.log("date.toISOString()", date.toISOString())
  console.groupEnd() */

  return date;
}
//console.log("😊😊 dateFromDateTimeStr('2022-06-02T23:59')", dateFromDateTimeStr('2022-06-02T23:59'))
//convert a string '2022-06-11' or 2022-06-11THH:MM
//to weekday, month day Thu, Jun 4
export function dateStrShort(str) {
  let date = dateFromDateStr(str);
  let dateStr = date.toUTCString();
  let parts = dateStr.split(' ');
  let dow = parts[0];
  let day = parts[1];
  let mon = parts[2];
  let dateStrShort = dow + " " + mon + " " + day;
  return dateStrShort;
}

//extract a time sting HH:MM from a data string
//DD-MM-YYTHH:SS
export function timeStr(str) {
  return str.substring(11);
}
//converts a timestamp into a date string
function dateStrFromTimestamp(timestamp) {
  const date = new Date(timestamp)
  const year = date.getUTCFullYear();
  const monthNum = date.getUTCMonth() + 1;
  let month = monthNum.toString();
  if (month.length === 1) month = "0" + month;
  const dayNum = date.getUTCDate();
  let day = dayNum.toString();
  if (day.length === 1) day = "0" + day;
  return year.toString() + "-" + month + "-" + day;
}
//console.log("😊😊 dateStrFromTimestamp(1693958400000)", dateStrFromTimestamp(1693958400000))

//converts a timestamp into a datetime string
function dateTimeStrFromTimestamp(timestamp){
  const date = new Date(timestamp);
  const str = date.toISOString();
  const dateTimeStr = str.substring(0,16)
  return dateTimeStr
}
//console.log("😊😊 dateStrFromTimestamp(1693958400000)", dateTimeStrFromTimestamp(1693958400000))

//From two DateTime strings '2022-06-02T11:00'
//get an array of date strings '2022-06-03' from a start date to an end date
export function tripDates(startStr, endStr) {
  const startTime = timestampFromDateTimeStr(startStr);
  const endTime = timestampFromDateTimeStr(endStr); 

  let dates = [];
  for (let i = startTime; i < endTime - MILLISECONDS_IN_DAY; i = i + MILLISECONDS_IN_DAY) {
    let newDate = new Date(i);
    let timestamp = newDate.getTime();
/* 
    console.group(newDate);
      console.log("i", i);
      console.log("timestamp", timestamp);
      console.log(dateTimeStrFromTimestamp(timestamp));
    console.groupEnd(); */

    dates.push(dateTimeStrFromTimestamp(timestamp));
  } 
  dates.push(dateTimeStrFromTimestamp(endTime));
  
/*   console.group('tripDates')
    console.group('Start')
      console.log("startStr", startStr);
      console.log("startTime", startTime);
      console.log("dateTimeStrFromTimeStamp(startTime)", dateTimeStrFromTimestamp(startTime))
    console.groupEnd()
    console.group('End')
      console.log("endStr", endStr);
      console.log("endTime", endTime);
      console.log("dateTimeStrFromTimeStamp(endTime)", dateTimeStrFromTimestamp(endTime))
    console.groupEnd()
  console.log("dates", dates)
  console.groupEnd(); */

  return dates;
}

//From two DateTime strings '2022-06-02T11:00'
//get an array of date strings '2022-06-03' between two dates
//used by Room to make trip detail items for stayDates
export function stayDates(startStr, endStr, withTime) {
  const startDate = dateFromDateTimeStr(startStr);
  const startTime = startDate.getTime();
  const endDate = dateFromDateTimeStr(endStr);
  const endTime = endDate.getTime();
  let dates = [];
  for (
    let i = startTime + MILLISECONDS_IN_DAY;
    i < endTime;
    i = i + MILLISECONDS_IN_DAY
  ) {
    let newDate = new Date(i);
    withTime
      ? dates.push(dateStrFromTimestamp(newDate) + "T00:00")
      : dates.push(dateStrFromTimestamp(newDate));
  }
  return dates;
}

//calculate the difference between two dates in days

function dateDiff(start, end) {
  const dStart = timestampFromDateTimeStr(start);
  const dEnd = timestampFromDateTimeStr(end);
  const diffMilliseconds = dEnd - dStart;
  return diffMilliseconds;
}

export function newEndDate(oldStart, newStart, oldEnd) {
  const diffM = dateDiff(oldStart, newStart);
  const dOld = timestampFromDateTimeStr(oldEnd);
  const dNew = dOld + diffM;
  const _newEndDate = dateTimeStrFromTimestamp(dNew);
  return [_newEndDate, diffM ]
}

export function movedDate(oldDate, diffM){  
  const dOld = timestampFromDateTimeStr(oldDate);
  const dNew = dOld + diffM;
  const _movedDate = dateTimeStrFromTimestamp(dNew);
  return _movedDate;
}

