/**
 * Dashboard — three-lane board layout.
 * Desktop: Planned / In Progress / Complete columns side by side.
 * Mobile: status-filter tabs to switch between single-column views.
 * Search and sort live in a toolbar above the board.
 * All data flow (API calls, state) unchanged from original.
 */
import { useState, useEffect, useCallback } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../services/api';
import Navbar from '../components/Navbar';
import TaskForm from '../components/TaskForm';
import TaskCard from '../components/TaskCard';

const LANE_STATUSES = ['Planned', 'In Progress', 'Complete'];

const LANE_DOT_CLASS = {
  'Planned':     'lane-dot lane-dot-planned',
  'In Progress': 'lane-dot lane-dot-progress',
  'Complete':    'lane-dot lane-dot-complete',
};

const EMPTY_LANE_MESSAGES = {
  'Planned':     'Nothing planned yet',
  'In Progress': 'Nothing in progress',
  'Complete':    'Nothing completed yet',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');

  // Client-side controls
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortOrder, setSortOrder]       = useState('newest'); // 'newest' | 'oldest'
  // Mobile tab — which lane is visible on narrow screens
  const [mobileTab, setMobileTab]       = useState(''); // '' = All (shown for mobile UX)

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getTasks(); // fetch all, no server-side status filter
      setTasks(res.data);
    } catch (err) {
      if (!err.response) {
        setError('Cannot reach the server. Please check your connection.');
      } else {
        setError(err.response?.data?.detail || 'Failed to load tasks.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Task handlers with transient toast notifications ───────────────────────
  const handleCreate = async (data) => {
    const res = await createTask(data);
    setTasks((prev) => [res.data, ...prev]);
    showToast('Task created');
    return res.data;
  };

  const handleUpdate = async (taskId, data) => {
    const res = await updateTask(taskId, data);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    showToast('Task updated');
  };

  const handleStatusChange = async (taskId, status) => {
    const res = await updateTaskStatus(taskId, status);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? res.data : t)));
    showToast('Status updated');
  };

  const handleDelete = async (taskId) => {
    await deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast('Task deleted');
  };

  // ── Derive displayed tasks per lane ───────────────────────────────────────
  const byLane = (status) =>
    tasks
      .filter((t) => t.status === status)
      .filter((t) => !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a, b) => {
        const tA = new Date(a.created_at).getTime();
        const tB = new Date(b.created_at).getTime();
        return sortOrder === 'newest' ? tB - tA : tA - tB;
      });

  const counts = Object.fromEntries(
    LANE_STATUSES.map((s) => [s, tasks.filter((t) => t.status === s).length])
  );

  // Mobile: a lane is hidden when a specific tab is active and it's not this lane
  const isLaneHidden = (status) => mobileTab !== '' && mobileTab !== status;

  return (
    <div className="dashboard-page">
      <Navbar user={user} />

      <div className="dashboard-body">
        {/* Page Heading */}
        <h1 className="page-heading">Your tasks</h1>

        {/* Create task panel */}
        <section className="create-panel" aria-label="Create a new task">
          <span className="create-panel-label">New task</span>
          <TaskForm onSubmit={handleCreate} />
        </section>

        {/* Toolbar: search + sort + mobile filter tabs */}
        <div>
          <div className="board-toolbar">
            <div className="search-wrapper">
              <span className="search-icon" aria-hidden="true">
                <Search size={15} strokeWidth={2} />
              </span>
              <input
                id="task-search"
                type="search"
                className="form-input search-input"
                placeholder="Search by title…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search tasks by title"
              />
            </div>

            <button
              id="sort-toggle"
              className="btn btn-outline btn-sm"
              onClick={() => setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
              aria-label={`Sort order: ${sortOrder} first. Click to toggle.`}
            >
              <ArrowUpDown size={13} strokeWidth={2} />
              <span>{sortOrder === 'newest' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>

          {/* Mobile filter tabs — visible below 720px */}
          <div
            className="mobile-filter-tabs"
            role="tablist"
            aria-label="Filter by status"
          >
            {/* "All" tab */}
            <button
              role="tab"
              aria-selected={mobileTab === ''}
              id="filter-tab-all"
              className={`filter-tab${mobileTab === '' ? ' active' : ''}`}
              onClick={() => setMobileTab('')}
            >
              All
              <span className="tab-count">{tasks.length}</span>
            </button>
            {LANE_STATUSES.map((s) => (
              <button
                key={s}
                role="tab"
                aria-selected={mobileTab === s}
                id={`filter-tab-${s.replace(' ', '-').toLowerCase()}`}
                className={`filter-tab${mobileTab === s ? ' active' : ''}`}
                onClick={() => setMobileTab(s)}
              >
                {s}
                <span className="tab-count">{counts[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" role="alert">{error}</div>
        )}

        {/* Global zero-task state when no tasks exist at all */}
        {!loading && !error && tasks.length === 0 && (
          <div className="board-zero-state" role="status">
            <p>No tasks yet — add your first one above</p>
          </div>
        )}

        {/* Three-lane board */}
        <div className="board" role="main" aria-label="Task board">
          {loading ? (
            // Skeleton loading: 2-3 placeholder cards per lane
            LANE_STATUSES.map((status) => (
              <section
                key={status}
                className="board-lane"
                data-hidden={isLaneHidden(status) ? 'true' : 'false'}
                aria-label={`${status} lane loading`}
              >
                <div className="lane-header" data-status={status}>
                  <div className="lane-header-left">
                    <span className={LANE_DOT_CLASS[status]} aria-hidden="true" />
                    <h2 className="lane-title">{status}</h2>
                  </div>
                  <span className="lane-count">…</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[1, 2].map((i) => (
                    <div key={i} className="skeleton-card" aria-hidden="true">
                      <div className="sk-line sk-title" />
                      <div className="sk-line sk-body" />
                      <div className="sk-line sk-meta" />
                    </div>
                  ))}
                </div>
              </section>
            ))
          ) : (
            LANE_STATUSES.map((status) => {
              const laneTasks = byLane(status);
              return (
                <section
                  key={status}
                  className="board-lane"
                  data-hidden={isLaneHidden(status) ? 'true' : 'false'}
                  aria-label={`${status} lane`}
                >
                  {/* Lane header */}
                  <div className="lane-header" data-status={status}>
                    <div className="lane-header-left">
                      <span className={LANE_DOT_CLASS[status]} aria-hidden="true" />
                      <h2 className="lane-title">{status}</h2>
                    </div>
                    <span className="lane-count" aria-label={`${counts[status]} tasks`}>
                      {counts[status]}
                    </span>
                  </div>

                  {/* Cards */}
                  {laneTasks.length === 0 ? (
                    <div className="lane-empty">
                      {searchQuery ? 'No matching tasks' : EMPTY_LANE_MESSAGES[status]}
                    </div>
                  ) : (
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'none' }} aria-label={`${status} tasks`}>
                      {laneTasks.map((task) => (
                        <li key={task.id}>
                          <TaskCard
                            task={task}
                            onUpdate={handleUpdate}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
