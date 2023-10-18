import { dateStrLong, dateStrShort } from '@/utils';

export default function returnNewCurrentTrip (item){
    const newCurrentTrip = {
      key: item.key,
      atrip_LongName:
        item.atrip_Name +
        ':  ' +
        dateStrLong(item.bstart_Date) +
        ' to ' +
        dateStrLong(item.cend_Date),
      atrip_Name:
        item.atrip_Name +
        ':  ' +
        dateStrShort(item.bstart_Date) +
        ' to ' +
        dateStrShort(item.cend_Date),
      atrip_Title: item.atrip_Name,
      atrip_Dates: dateStrShort(item.bstart_Date) +
        ' to ' +
        dateStrShort(item.cend_Date),
      atrip_LongDates: dateStrLong(item.bstart_Date) +
        ' to ' +
        dateStrLong(item.cend_Date)
    }
    return newCurrentTrip;
}