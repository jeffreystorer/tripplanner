import * as _ from 'lodash';
import { newEndDate, movedDate} from '@/utils';

export default function moveTrip(newStartDate, data){
    const [ _newEndDate, diffM ] = newEndDate(data.bstart_Date, newStartDate, data.cend_Date)
    const newData = _.cloneDeep(data);
    newData.bstart_Date = newStartDate;
    newData.cend_Date = _newEndDate;
    function moveDetailDates(){
        for (const [key, value] of Object.entries(newData.details.activity)){
            newData.details.activity[key].astart_Date = movedDate(value.astart_Date, diffM);
        }
        for (const [key, value] of Object.entries(newData.details.car)){
            newData.details.car[key].astart = movedDate(value.astart, diffM);
            newData.details.car[key].bend = movedDate(value.bend, diffM);
        }
        for (const [key, value] of Object.entries(newData.details.room)){
            newData.details.room[key].astart_Date = movedDate(value.astart_Date, diffM);
            newData.details.room[key].bend_Date = movedDate(value.bend_Date, diffM);
        }
        for (const [key, value] of Object.entries(newData.details.transport)){
            newData.details.transport[key].astart = movedDate(value.astart, diffM);
            newData.details.transport[key].bend = movedDate(value.bend, diffM);
        }
    }
    moveDetailDates();
    return newData;
}
