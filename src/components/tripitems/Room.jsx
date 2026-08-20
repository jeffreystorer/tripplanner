import { dateStrShort, linkify } from '@/utils';

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
                {item.ddetails && (
                  <>
                    <br />
                    {linkify(item.ddetails)}
                  </>
                )}
      </p>
  )});

  return <>{items}</>;
}
