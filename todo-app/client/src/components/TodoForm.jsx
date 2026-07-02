import React, { useState, useEffect } from "react";
import { Plus, Check, X, Calendar, Tag, AlertCircle } from "lucide-react";

function TodoForm({ addTask, editTask, updateTask, cancelEdit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("personal");
  const [dueDate, setDueDate] = useState("");

  // Populate form if in edit mode
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setPriority(editTask.priority || "medium");
      setCategory(editTask.category || "personal");
      if (editTask.dueDate) {
        // Format date to YYYY-MM-DD for input field
        const d = new Date(editTask.dueDate);
        const formattedDate = d.toISOString().split("T")[0];
        setDueDate(formattedDate);
      } else {
        setDueDate("");
      }
    } else {
      // Clear form when exiting edit mode
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("personal");
      setDueDate("");
    }
  }, [editTask]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) return;

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    if (editTask) {
      updateTask(editTask._id, taskData);
    } else {
      addTask(taskData);
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategory("personal");
      setDueDate("");
    }
  };

  return (
    <div className={`form-container ${editTask ? "edit-mode-active" : ""}`}>
      <div className="form-header">
        <h3>{editTask ? "Edit Task Details" : "Create New Task"}</h3>
        {editTask && (
          <button className="cancel-icon-btn" onClick={cancelEdit} title="Cancel Editing">
            <X size={18} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {/* Title Input */}
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            required
            maxLength={100}
          />
        </div>

        {/* Description Input */}
        <div className="form-group">
          <textarea
            className="form-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add description or notes..."
            rows={2}
            maxLength={500}
          />
        </div>

        {/* Priority & Category & DueDate Flex Box */}
        <div className="form-row">
          {/* Priority */}
          <div className="form-group flex-1">
            <label className="form-label">
              <AlertCircle size={14} className="label-icon" /> Priority
            </label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Category */}
          <div className="form-group flex-1">
            <label className="form-label">
              <Tag size={14} className="label-icon" /> Category
            </label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="shopping">Shopping</option>
              <option value="fitness">Fitness</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label className="form-label">
            <Calendar size={14} className="label-icon" /> Due Date
          </label>
          <input
            type="date"
            className="form-input-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          {editTask ? (
            <>
              <button type="submit" className="btn btn-primary submit-btn">
                <Check size={18} /> Save Changes
              </button>
              <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                Cancel
              </button>
            </>
          ) : (
            <button type="submit" className="btn btn-primary submit-btn" disabled={!title.trim()}>
              <Plus size={18} /> Add Task
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TodoForm;