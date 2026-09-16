import { useState } from 'react';

export default function TaskForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', description: '', due_date: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (field === 'title') setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Title is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        due_date: form.due_date || undefined,
      });
      setForm({ title: '', description: '', due_date: '' });
    } catch (err) {
      const data = err.response?.data;
      if (err.response?.status === 422 && Array.isArray(data?.detail)) {
        setError(data.detail[0]?.msg || 'Invalid input.');
      } else {
        setError(data?.detail || 'Failed to create task.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="task-form-fields">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="task-title" className="form-label">
            Title <span aria-hidden="true" style={{ color: 'var(--status-in-progress)' }}>*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={`form-input${error ? ' input-error' : ''}`}
            placeholder="What needs to be done?"
            value={form.title}
            onChange={handleChange('title')}
            maxLength={200}
          />
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="task-description" className="form-label">Description</label>
          <input
            id="task-description"
            type="text"
            className="form-input"
            placeholder="Optional details"
            value={form.description}
            onChange={handleChange('description')}
            maxLength={500}
          />
        </div>

        {/* Due date */}
        <div className="form-group">
          <label htmlFor="task-due-date" className="form-label">Due date</label>
          <input
            id="task-due-date"
            type="datetime-local"
            className="form-input"
            value={form.due_date}
            onChange={handleChange('due_date')}
          />
        </div>

        {/* Submit */}
        <div className="form-group" style={{ justifyContent: 'flex-end' }}>
          <button
            type="submit"
            id="create-task-btn"
            className="btn btn-primary"
            disabled={loading}
            style={{ alignSelf: 'flex-end' }}
          >
            {loading ? <><span className="spinner" /> Adding…</> : '+ Add task'}
          </button>
        </div>
      </div>
    </form>
  );
}
