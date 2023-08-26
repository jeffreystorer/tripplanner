import { v4 as uuidv4 } from 'uuid';
import { dateStrShort} from '@/utils';

export default function Room({ data, onClick }) {
  
  const items =  data?.map((detail, index) => {
    const item = {...detail, type: 'room'};
  return (
      <p key={uuidv4()} className='item' onClick={e => onClick(item, e)}>
          <strong>
            {dateStrShort(Object.values(item)[0])}{' - '}{dateStrShort(Object.values(item)[1])}
            &nbsp;
            </strong>
                {Object.values(item)[2]}
      </p>
  )});
  
  return <>{items}</>;
}
