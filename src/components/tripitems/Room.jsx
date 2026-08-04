import { dateStrShort} from '@/utils';

export default function Room({ data, onClick }) {

  const items =  data?.map((detail) => {
    const item = {...detail, type: 'room'};
  return (
      <p key={item.key} className='item' onClick={e => onClick(item, e)}>
          <strong>
            {dateStrShort(item.astart_Date)}{' - '}{dateStrShort(item.bend_Date)}
            &nbsp;
            </strong>
                {item.croom}
      </p>
  )});

  return <>{items}</>;
}
