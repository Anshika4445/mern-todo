import { useEffect, useState } from "react";
const blank = {
  title: "",
  description: "",
  status: "Pending",
  priority: "Medium",
  dueDate: "",
};
export default function TaskForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(blank);
  useEffect(
    () =>
      setForm(
        editing
          ? {
              ...editing,
              dueDate: editing.dueDate ? editing.dueDate.slice(0, 10) : "",
            }
          : blank,
      ),
    [editing],
  );
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = (e) => {
    e.preventDefault();
    onSave({ ...form, dueDate: form.dueDate || null });
  };
  return (
    <form className="task-form" onSubmit={submit}>
      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={change}
        required
        maxLength="120"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={change}
      />
      <div className="grid3">
        <select name="status" value={form.status} onChange={change}>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Completed</option>
        </select>
        <select name="priority" value={form.priority} onChange={change}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={change}
        />
      </div>
      <div className="actions">
        <button type="submit">{editing ? "Update Task" : "Add Task"}</button>
        {editing && (
          <button type="button" className="ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
