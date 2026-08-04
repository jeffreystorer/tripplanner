import { incrementDate, stayDates} from '@/utils';


//next: use tripDates to get array of dates afer insert, and use includes
export default function insertDate(insertAfterDate, tripData){
    const newTripData = structuredClone(tripData);
    newTripData.cend_Date = incrementDate(newTripData.cend_Date);
    const datesToMove = stayDates(insertAfterDate, newTripData.cend_Date, false);
    function incrementDetailDates(){
        if (newTripData.details?.activity) {
            for (const value of Object.entries(newTripData.details?.activity)){
                if (datesToMove.includes(value[1].astart_Date.substring(0,10))){
                    value[1].astart_Date = incrementDate(value[1].astart_Date);
                }
            }
        }
        if (newTripData.details?.car){
            for (const value of Object.entries(newTripData.details?.car)){
                if (datesToMove.includes(value[1].astart.substring(0,10))){
                    value[1].astart = incrementDate(value[1].astart);
                    value[1].bend = incrementDate(value[1].bend);
                }
            }
        }
        if (newTripData.details?.room) {
            for (const value of Object.entries(newTripData.details?.room)){
                if (datesToMove.includes(value[1].astart_Date.substring(0,10))){
                    value[1].astart_Date = incrementDate(value[1].astart_Date);
                    value[1].bend_Date = incrementDate(value[1].bend_Date);
                }
            }
        }
        if (newTripData.details?.transport) {
            for (const value of Object.entries(newTripData.details?.transport)){
                if (datesToMove.includes(value[1].astart.substring(0,10))){
                    value[1].astart = incrementDate(value[1].astart);
                    value[1].bend = incrementDate(value[1].bend);
                }

            }
        }
    }
    incrementDetailDates();
    return newTripData;
}
