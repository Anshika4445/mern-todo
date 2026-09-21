export default function TaskCard({ task, onEdit, onDelete, onStatus }) {
  return (
    <article className="task-card">
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
        </div>
        <div className="task-actions">
          <button onClick={() => onEdit(task)}>Edit</button>
          <button className="danger" onClick={() => onDelete(task._id)}>
            Delete
          </button>
        </div>
      </div>
      <div className="meta">
        <span className={`badge status-${task.status}`}>{task.status}</span>
        <span className={`badge priority-${task.priority}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
        <select
          value={task.status}
          onChange={(e) => onStatus(task._id, e.target.value)}
        >
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>
      </div>
    </article>
  );
}
