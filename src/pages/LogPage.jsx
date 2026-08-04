import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import * as state from '@/store';
import { getLogs, clearLogs } from '@/services';

export default function LogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const userId = useRecoilValue(state.userId);

  useEffect(() => {
    getLogs(userId).then(data => {
      setLogs(data);
      setLoading(false);
    });
  }, [userId]);
  const handleClear = async () => {
    if (!window.confirm('Clear all log entries? This cannot be undone.')) return;
    await clearLogs(userId);
    setLogs([]);
    navigate('/pages/itinerary');
  };

  const toggleExpand = (key) => {
    setExpanded(expanded === key ? null : key);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div id="logs-page">
      <button onClick={handleClear}>Clear Log</button>
      <h2>Activity Log</h2>
      {logs.length === 0 ? (
        <p>No activity yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {logs.map(entry => (
              //the key belongs on the outermost mapped element, so this has to
              //be <Fragment key=...> - the <> shorthand cannot take props
              <Fragment key={entry.key}>
                <tr>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.action}</td>
                  <td>
                    <button onClick={() => toggleExpand(entry.key)}>
                      {expanded === entry.key ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {expanded === entry.key && (
                  <tr>
                    <td colSpan={3}>
                      {entry.action === 'update' ? (
                        <div>
                            <strong>New:</strong>
                            <pre>{JSON.stringify(entry.data?.new, null, 2)}</pre>
                            <strong>Old:</strong>
                            <pre>{JSON.stringify(entry.data?.old, null, 2)}</pre>
                        </div>
                        ) : (
                        <pre>{JSON.stringify(entry.data, null, 2)}</pre>
)}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}