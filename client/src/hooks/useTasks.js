import { useCallback, useEffect, useState } from 'react';
import api from '../services/api';

export default function useTasks(params) {
  const [data, setData] = useState({ tasks: [], pagination: { page: 1, pages: 0, total: 0 } });
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [taskResponse, statsResponse] = await Promise.all([
        api.get('/tasks', { params }),
        api.get('/tasks/stats')
      ]);
      setData(taskResponse.data);
      setStats(statsResponse.data.stats);
      setError('');
    } catch (e) {
      setError(e.response?.data?.message || 'Could not load tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { load(); }, [load]);

  const createTask = async task => { await api.post('/tasks', task); await load(); };
  const updateTask = async (id, task) => { await api.put(`/tasks/${id}`, task); await load(); };
  const updateStatus = async (id, status) => { await api.patch(`/tasks/${id}/status`, { status }); await load(); };
  const deleteTask = async id => { await api.delete(`/tasks/${id}`); await load(); };

  return { ...data, stats, loading, error, load, createTask, updateTask, updateStatus, deleteTask };
}
