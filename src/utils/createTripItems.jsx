import { Activity, Car, Note, Room, Travel } from '@/components/tripitems';

export default function createTripItems(page, data, onClick) {

  switch (page) {
    case 'activity':
      return <Activity data={data} onClick={onClick}/>;
    case 'car':
      return <Car data={data} onClick={onClick}/>;
    case 'note':
      return <Note data={data} onClick={onClick}/>;
    case 'room':
      return <Room data={data} onClick={onClick}/>;
    case 'travel':
      return <Travel data={data} onClick={onClick}/>;
    default:
      break;
  }
}
