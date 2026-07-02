import React from "react";
import { Trash2, Edit3, Calendar, Check, AlertTriangle, Sparkles } from "lucide-react";

function TodoList({ tasks, deleteTask, toggleComplete, setEditTask }) {
  // Format due date to a nice string
  const formatDueDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    
    // Check if valid date
    if (isNaN(date.getTime())) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    const diffTime = checkDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const options = { month: "short", day: "numeric" };
    const formatted = date.toLocaleDateString(undefined, options);

    if (diffDays < 0) {
      return { text: `Overdue (${formatted})`, type: "overdue" };
    } else if (diffDays === 0) {
      return { text: "Due Today", type: "today" };
    } else if (diffDays === 1) {
      return { text: "Due Tomorrow", type: "tomorrow" };
    } else {
      return { text: `Due ${formatted}`, type: "future" };
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-illustration">
          <Sparkles className="empty-sparkle-icon" size={48} />
          <div className="empty-circle-bg"></div>
        </div>
        <h4>All Clear!</h4>
        <p>No tasks match your search or filter. Relax, or add a new task to get ahead of your day!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const dueInfo = formatDueDate(task.dueDate);
        
        return (
          <div key={task._id} className={`task-card ${task.completed ? "task-completed" : ""} priority-${task.priority}`}>
            {/* Custom Checkbox */}
            <div 
              className={`custom-checkbox ${task.completed ? "checked" : ""}`}
              onClick={() => toggleComplete(task)}
              title={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              <div className="checkbox-inner">
                {task.completed && <Check size={14} className="check-icon" />}
              </div>
            </div>

            {/* Task Content */}
            <div className="task-content">
              <div className="task-title-row">
                <h4 className="task-title">{task.title}</h4>
              </div>
              
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              {/* Task Meta Row (Badges and Dates) */}
              <div className="task-meta">
                {/* Category Badge */}
                <span className={`badge badge-category cat-${task.category}`}>
                  {task.category}
                </span>

                {/* Priority Badge */}
                <span className={`badge badge-priority prio-${task.priority}`}>
                  {task.priority}
                </span>

                {/* Due Date Indicator */}
                {dueInfo && !task.completed && (
                  <span className={`due-date ${dueInfo.type}`}>
                    {dueInfo.type === "overdue" ? (
                      <AlertTriangle size={12} className="due-icon" />
                    ) : (
                      <Calendar size={12} className="due-icon" />
                    )}
                    {dueInfo.text}
                  </span>
                )}

                {/* Due Date Indicator (Completed task) */}
                {task.dueDate && task.completed && (
                  <span className="due-date completed-date">
                    <Calendar size={12} className="due-icon" />
                    Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                )}
              </div>
            </div>

            {/* Task Card Actions */}
            <div className="task-actions">
              <button 
                className="action-btn edit-btn" 
                onClick={() => setEditTask(task)}
                title="Edit task"
                disabled={task.completed}
              >
                <Edit3 size={16} />
              </button>
              <button 
                className="action-btn delete-btn" 
                onClick={() => deleteTask(task._id)}
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TodoList;