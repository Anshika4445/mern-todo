import { useMemo, useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import useTasks from "../hooks/useTasks";

export default function Dashboard() {
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const params = useMemo(
    () => ({
      status: status || undefined,
      priority: priority || undefined,
      search: search || undefined,
      sortBy,
      order,
      page,
      limit: 8,
    }),
    [status, priority, search, sortBy, order, page],
  );

  const {
    tasks,
    pagination,
    stats,
    loading,
    error,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  } = useTasks(params);

  const save = async (task) => {
    if (editing) await updateTask(editing._id, task);
    else await createTask(task);
    setEditing(null);
    setShowForm(false);
  };

  const resetFilters = () => {
    setStatus("");
    setPriority("");
    setSearch("");
    setSortBy("createdAt");
    setOrder("desc");
    setPage(1);
  };

  return (
    <main className="dashboard">
      <div className="title-row">
        <div>
          <h1>My Tasks</h1>
          <p>Plan, track and complete your work.</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Task
        </button>
      </div>

      <section className="stats">
        <div>
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div>
          <strong>{stats.pending}</strong>
          <span>Pending</span>
        </div>
        <div>
          <strong>{stats.inProgress}</strong>
          <span>In-Progress</span>
        </div>
        <div>
          <strong>{stats.completed}</strong>
          <span>Completed</span>
        </div>
      </section>

      {showForm && (
        <TaskForm
          editing={editing}
          onSave={save}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}

      <section className="filters">
        <input
          placeholder="Search tasks…"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>
        <select
          value={priority}
          onChange={(e) => {
            setPage(1);
            setPriority(e.target.value);
          }}
        >
          <option value="">All priorities</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="createdAt">Created</option>
          <option value="updatedAt">Updated</option>
          <option value="dueDate">Due date</option>
          <option value="title">Title</option>
          <option value="priority">Priority</option>
        </select>
        <button
          className="ghost"
          onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
        >
          {order === "asc" ? "↑ Asc" : "↓ Desc"}
        </button>
        <button className="ghost" onClick={resetFilters}>
          Reset
        </button>
      </section>

      {error && <div className="error">{error}</div>}
      {loading ? (
        <div className="center">Loading tasks…</div>
      ) : tasks.length ? (
        <section className="tasks">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={(task) => {
                setEditing(task);
                setShowForm(true);
              }}
              onDelete={async (id) => {
                if (window.confirm("Delete this task?")) await deleteTask(id);
              }}
              onStatus={updateStatus}
            />
          ))}
        </section>
      ) : (
        <div className="empty">
          <h2>No tasks found</h2>
          <p>Create a task or change your filters.</p>
        </div>
      )}

      <div className="pagination">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>
          Page {pagination.page} of {Math.max(pagination.pages, 1)}
        </span>
        <button
          disabled={!pagination.pages || page >= pagination.pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
