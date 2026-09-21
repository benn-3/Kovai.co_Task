import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const STATUSES = ['Planned', 'In Progress', 'Complete'];

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function isOverdue(dueDateIso, status) {
  if (!dueDateIso || status === 'Complete') return false;
  return new Date(dueDateIso) < new Date();
}

export default function TaskCard({ task, onUpdate, onStatusChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: task.title, description: task.description || '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const overdue = isOverdue(task.due_date, task.status);

  // ── Status change ─────────────────────────────────────────────────────────
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatusLoading(true);
    try {
      await onStatusChange(task.id, newStatus);
    } catch (err) {
      console.error('Status update failed:', err);
    } finally {
      setStatusLoading(false);
    }
  };

  // ── Inline edit ───────────────────────────────────────────────────────────
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) {
      setEditError('Title is required.');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      await onUpdate(task.id, {
        title: editForm.title.trim(),
        description: editForm.description.trim() || undefined,
      });
      setIsEditing(false);
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 422 && Array.isArray(data?.detail)) {
        setEditError(data.detail[0]?.msg || 'Invalid input.');
      } else {
        setEditError(data?.detail || 'Update failed.');
      }
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditForm({ title: task.title, description: task.description || '' });
    setEditError('');
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    setDeleteLoading(true);
    try {
      await onDelete(task.id);
    } catch {
      setDeleteLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <article
        className="task-card"
        data-status={task.status}
        aria-label={`Task: ${task.title}`}
      >
        {/* Top accent bar is CSS ::before */}
        <div className="task-card-body">
          {/* Title */}
          <p className="task-title">{task.title}</p>

          {/* Description */}
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {/* Meta — dates */}
          <div className="task-meta">
            <span className="task-meta-item" title="Created">
              {formatDate(task.created_at)}
            </span>
            {task.due_date && (
              <span
                className="task-meta-item"
                style={overdue ? { color: 'var(--danger)' } : {}}
                title="Due date"
              >
                Due {formatDate(task.due_date)}
                {overdue && <span className="overdue-badge">overdue</span>}
              </span>
            )}
          </div>
        </div>

        {/* Inline edit */}
        {isEditing && (
          <div className="inline-edit">
            <div className="form-group">
              <label htmlFor={`edit-title-${task.id}`} className="form-label" style={{ fontSize: '13px' }}>
                Title
              </label>
              <input
                id={`edit-title-${task.id}`}
                type="text"
                className={`form-input${editError ? ' input-error' : ''}`}
                value={editForm.title}
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                maxLength={200}
              />
              {editError && <p className="form-error">{editError}</p>}
            </div>
            <div className="form-group">
              <label htmlFor={`edit-desc-${task.id}`} className="form-label" style={{ fontSize: '13px' }}>
                Description
              </label>
              <textarea
                id={`edit-desc-${task.id}`}
                className="form-input"
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                rows={2}
                maxLength={1000}
              />
            </div>
            <div className="inline-edit-actions">
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleEditSubmit}
                disabled={editLoading}
                id={`save-edit-${task.id}`}
              >
                {editLoading ? <><span className="spinner" /> Saving…</> : 'Save'}
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleEditCancel}
                id={`cancel-edit-${task.id}`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Footer: status select + icon actions */}
        {!isEditing && (
          <div className="card-footer">
            <select
              className="status-select"
              value={task.status}
              onChange={handleStatusChange}
              disabled={statusLoading}
              aria-label={`Change status for: ${task.title}`}
              id={`status-select-${task.id}`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <div className="card-actions">
              <button
                className="icon-btn"
                onClick={() => setIsEditing(true)}
                aria-label={`Edit: ${task.title}`}
                id={`edit-btn-${task.id}`}
                title="Edit"
              >
                <Pencil size={13} strokeWidth={2} />
              </button>
              <button
                className="icon-btn icon-btn-delete"
                onClick={() => setShowConfirm(true)}
                aria-label={`Delete: ${task.title}`}
                id={`delete-btn-${task.id}`}
                title="Delete"
              >
                <Trash2 size={13} strokeWidth={2} />
              </button>
            </div>
          </div>
        )}
      </article>

      {/* Delete confirmation */}
      {showConfirm && (
        <div
          className="confirm-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`confirm-title-${task.id}`}
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="confirm-dialog">
            <p className="confirm-title" id={`confirm-title-${task.id}`}>Delete task?</p>
            <p className="confirm-body">
              "<strong>{task.title}</strong>" will be permanently removed.
            </p>
            <div className="confirm-actions">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setShowConfirm(false)}
                id={`confirm-cancel-${task.id}`}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete btn-sm"
                onClick={handleDeleteConfirm}
                disabled={deleteLoading}
                id={`confirm-delete-${task.id}`}
              >
                {deleteLoading ? <><span className="spinner" /> Deleting…</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
