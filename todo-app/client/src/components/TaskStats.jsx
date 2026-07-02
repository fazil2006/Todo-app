import React from "react";
import { CheckCircle2, Clock, ListTodo, TrendingUp } from "lucide-react";

function TaskStats({ tasks, filterStatus, setFilterStatus }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="stats-container">
      {/* Progress Circle & Summary */}
      <div className="stats-progress-card">
        <div className="progress-ring-wrapper">
          <svg className="progress-ring" width="80" height="80">
            <circle
              className="progress-ring-bg"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="6"
              fill="transparent"
              r="34"
              cx="40"
              cy="40"
            />
            <circle
              className="progress-ring-bar"
              stroke="url(#progress-gradient)"
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 34}
              strokeDashoffset={2 * Math.PI * 34 * (1 - completionRate / 100)}
              strokeLinecap="round"
              fill="transparent"
              r="34"
              cx="40"
              cy="40"
            />
            <defs>
              <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="progress-percentage">{completionRate}%</div>
        </div>
        <div className="progress-info">
          <h3>Progress Tracker</h3>
          <p>
            {completionRate === 100
              ? "🎉 Excellent work! All tasks completed!"
              : `${completedTasks} of ${totalTasks} tasks completed`}
          </p>
        </div>
      </div>

      {/* Stats Mini Cards Grid */}
      <div className="stats-grid">
        <div
          className={`stat-card ${filterStatus === "all" ? "active-filter" : ""}`}
          onClick={() => setFilterStatus("all")}
        >
          <div className="stat-icon-wrapper all">
            <ListTodo size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div
          className={`stat-card ${filterStatus === "active" ? "active-filter" : ""}`}
          onClick={() => setFilterStatus("active")}
        >
          <div className="stat-icon-wrapper active">
            <Clock size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{activeTasks}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>

        <div
          className={`stat-card ${filterStatus === "completed" ? "active-filter" : ""}`}
          onClick={() => setFilterStatus("completed")}
        >
          <div className="stat-icon-wrapper completed">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskStats;
