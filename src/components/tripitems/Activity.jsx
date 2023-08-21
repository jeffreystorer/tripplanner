
import { v4 as uuidv4 } from 'uuid';
import { dowMonthDayFromStr } from '@/utils';

export default function Activity({ data, onClick }) {

  const items = data?.map((detail) => {   
    const item = {...detail, type: 'activity'};
  return (
        <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
          <strong>
            {dowMonthDayFromStr(Object.values(item)[0], 'short')}        
          </strong><br />
        {Object.values(item)[1]}
        </p>
  )});

  return <>{items}</>
}
