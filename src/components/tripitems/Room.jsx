import { v4 as uuidv4 } from 'uuid';
import { dowMonthDayFromStr, stayDates } from '@/utils';

export default function Room({ data, onClick }) {
  
  const items =  data?.map((detail, index) => {
    const item = {...detail, type: 'room'};
  return (
      <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
          <strong>
            {dowMonthDayFromStr(Object.values(detail)[0], 'short')}{' - '}{dowMonthDayFromStr(Object.values(detail)[1], 'short')}&nbsp;
            </strong>
                {Object.values(detail)[2]}
      </p>
  )});
  
  return <>{items}</>;
}
