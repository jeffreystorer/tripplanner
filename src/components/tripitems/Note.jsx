import { Star } from 'react-feather';
import { v4 as uuidv4 } from 'uuid';

export default function Note({ data, onClick }) {

 

  const items = data?.map((detail, index) => {    
    const item = {...detail, type: 'note'}
  return (
    <div key={uuidv4()} className='note-item' onClick={e => onClick(item, e)}>
      <Star />&nbsp;&nbsp;
      <p className='item'>
        {Object.values(item)[0]}
      </p>
    </div>
  )});

  return <>{items}</>
}
