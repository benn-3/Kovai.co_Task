/**
 * TaskFilters — status filter tabs, status count badges,
 *               search input, and sort toggle. All client-side except the
 *               status filter which triggers a re-fetch via parent.
 */

const STATUSES = ['', 'Planned', 'In Progress', 'Complete'];

const STATUS_LABELS = {
  '': 'All',
  'Planned': 'Planned',
  'In Progress': 'In Progress',
  'Complete': 'Complete',
};

function countByStatus(tasks) {
  return {
    '': tasks.length,
    'Planned': tasks.filter((t) => t.status === 'Planned').length,
    'In Progress': tasks.filter((t) => t.status === 'In Progress').length,
    'Complete': tasks.filter((t) => t.status === 'Complete').length,
  };
}

export default function TaskFilters({
  tasks,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  sortOrder,
  setSortOrder,
}) {
  const counts = countByStatus(tasks);

  return (
    <div>
      {/* Status filter tabs */}
      <div className="filters-panel" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
        <div className="filter-tabs" role="tablist" aria-label="Filter by status">
          {STATUSES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={statusFilter === s}
              id={`filter-tab-${s || 'all'}`}
              className={`filter-tab${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {STATUS_LABELS[s]}
              <span className="count-badge">{counts[s]}</span>
            </button>
          ))}
        </div>

        {/* Status count chips (summary) */}
        <div className="status-counts" aria-label="Task status counts">
          <span className="status-chip chip-planned" title="Planned">
            📋 {counts['Planned']} Planned
          </span>
          <span className="status-chip chip-progress" title="In Progress">
            ⚡ {counts['In Progress']} In Progress
          </span>
          <span className="status-chip chip-complete" title="Complete">
            ✅ {counts['Complete']} Complete
          </span>
        </div>
      </div>

      {/* Search + Sort */}
      <div className="filters-panel" style={{ paddingTop: '0.75rem' }}>
        <div className="search-sort-row">
          <div className="search-input-wrapper">
            <span className="search-icon" aria-hidden="true">🔍</span>
            <input
              id="task-search"
              type="search"
              className="form-input search-input"
              placeholder="Search tasks by title…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks by title"
            />
          </div>

          <button
            id="sort-toggle"
            className="btn btn-ghost btn-sm"
            onClick={() => setSortOrder((o) => (o === 'newest' ? 'oldest' : 'newest'))}
            title={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
            aria-label={`Currently sorting by ${sortOrder} first. Click to switch.`}
          >
            {sortOrder === 'newest' ? '↓ Newest' : '↑ Oldest'}
          </button>
        </div>
      </div>
    </div>
  );
}
