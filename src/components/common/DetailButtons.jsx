import { useNavigate } from 'react-router-dom';
import { Plus } from 'react-feather';

export default function DetailButtons() {
  const navigate = useNavigate();

  return (
    <div id='detail-buttons'>
      <div>
        <button onClick={() => navigate('/pages/addnote')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/note')}>
            Notes
        </button>
      </div>
      <div>
        <button onClick={() => navigate('/pages/addactivity')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/activity')}>
            Activities
        </button>
      </div>
      <div>
        <button
          onClick={() => navigate('/pages/addcar')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/car')}>
            Cars
        </button>
      </div>
      <div>
        <button onClick={() => navigate('/pages/addmap')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/map')}>
            Map Links
        </button>
      </div>
      <div>
        <button onClick={() => navigate('/pages/addroom')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/room')}>
            Rooms
        </button>
      </div>
      <div>        
        <button onClick={() => navigate('/pages/addtransport')}
          >
            <Plus />
        </button>
        <button  onClick={() => navigate('/pages/transport')}>
            Transports
        </button>
      </div>
    </div>
  );
}
