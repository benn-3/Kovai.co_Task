/**
 * TaskList — renders task cards or empty/loading states.
 */
import TaskCard from './TaskCard';

export default function TaskList({ tasks, loading, onUpdate, onStatusChange, onDelete }) {
  if (loading) {
    return (
      <div className="empty-state" aria-live="polite" aria-busy="true">
        <span className="empty-state-icon">
          <span className="spinner" style={{ fontSize: '2rem', width: '2rem', height: '2rem' }} />
        </span>
        <p className="empty-state-title">Loading tasks…</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state" aria-live="polite">
        <span className="empty-state-icon">📭</span>
        <p className="empty-state-title">No tasks found</p>
        <p className="empty-state-subtitle">
          Create your first task above, or adjust your filters and search.
        </p>
      </div>
    );
  }

  return (
    <ul className="task-list" role="list" aria-label="Task list">
      {tasks.map((task) => (
        <li key={task.id} role="listitem">
          <TaskCard
            task={task}
            onUpdate={onUpdate}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
          />
        </li>
      ))}
    </ul>
  );
}
