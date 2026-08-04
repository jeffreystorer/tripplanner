import { decrementDate, stayDates} from '@/utils';


//next: use tripDates to get array of dates afer insert, and use includes
export default function deleteDate(deleteDate, tripData){
    const newTripData = structuredClone(tripData);
    newTripData.cend_Date = decrementDate(newTripData.cend_Date);
    const datesToMove = stayDates(deleteDate, newTripData.cend_Date, false);
    function deletDetail(startDate, detailObj){
        const keysToDelete = [];

        for (const [key, value] of Object.entries(newTripData.details[detailObj])){
            if (value[startDate].substring(0,10) === deleteDate.substring(0,10)){
                keysToDelete.push(key);
            }
        }

        keysToDelete.forEach(key => {
            delete newTripData.details[detailObj][key];
        });

    }
    function decrementDetailDates(){

        if (newTripData.details?.activity) {
            deletDetail('astart_Date', 'activity');
            for (const value of Object.entries(newTripData.details?.activity)){
                if (datesToMove.includes(value[1].astart_Date.substring(0,10))){
                    value[1].astart_Date = decrementDate(value[1].astart_Date);
                }
            }
        }
        if (newTripData.details?.car){
            deletDetail('astart', 'car');
            for (const value of Object.entries(newTripData.details?.car)){
                if (datesToMove.includes(value[1].astart.substring(0,10))){
                    value[1].astart = decrementDate(value[1].astart);
                    value[1].bend = decrementDate(value[1].bend);
                }
            }
        }
        if (newTripData.details?.room) {
            deletDetail('astart_Date', 'room');
            for (const value of Object.entries(newTripData.details?.room)){
                if (datesToMove.includes(value[1].astart_Date.substring(0,10))){
                    value[1].astart_Date = decrementDate(value[1].astart_Date);
                    value[1].bend_Date = decrementDate(value[1].bend_Date);
                }
            }
        }
        if (newTripData.details?.transport) {
            deletDetail('astart', 'transport');
            for (const value of Object.entries(newTripData.details?.transport)){
                if (datesToMove.includes(value[1].astart.substring(0,10))){
                    value[1].astart = decrementDate(value[1].astart);
                    value[1].bend = decrementDate(value[1].bend);
                }

            }
        }
    }
    decrementDetailDates();
    return newTripData;
}
