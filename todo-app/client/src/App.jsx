import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TaskStats from "./components/TaskStats";
import { Search, Sparkles, AlertCircle, RefreshCw, Layers, SlidersHorizontal, Sun, Moon } from "lucide-react";

const API = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtering states
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed
  const [filterPriority, setFilterPriority] = useState("all"); // all, high, medium, low
  const [filterCategory, setFilterCategory] = useState("all"); // all, work, personal, shopping, etc.
  const [searchQuery, setSearchQuery] = useState("");
  
  // Custom toast notification state
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  // Show a notification toast
  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  // Fetch tasks from backend
  const getTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build search params
      const params = {};
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterPriority !== "all") params.priority = filterPriority;
      if (filterCategory !== "all") params.category = filterCategory;
      if (searchQuery.trim() !== "") params.search = searchQuery.trim();

      const res = await axios.get(API, { params });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to connect to the database. Please make sure the backend server is running.");
      showToast("Network Error: Could not load tasks", "error");
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterPriority, filterCategory, searchQuery, showToast]);

  // Fetch tasks on filter change
  useEffect(() => {
    getTasks();
  }, [getTasks]);

  // Create a new task
  const addTask = async (taskData) => {
    try {
      setError("");
      const res = await axios.post(API, taskData);
      setTasks((prevTasks) => [res.data, ...prevTasks]);
      showToast("🎉 Task added successfully!");
    } catch (err) {
      console.error("Error adding task:", err);
      showToast("Error: Could not add task", "error");
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      setError("");
      await axios.delete(`${API}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t._id !== id));
      if (editTask && editTask._id === id) {
        setEditTask(null);
      }
      showToast("🗑️ Task deleted successfully!");
    } catch (err) {
      console.error("Error deleting task:", err);
      showToast("Error: Could not delete task", "error");
    }
  };

  // Toggle completion status
  const toggleComplete = async (task) => {
    try {
      setError("");
      const res = await axios.put(`${API}/${task._id}`, {
        completed: !task.completed,
      });
      
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === task._id ? res.data : t))
      );
      
      if (!task.completed) {
        showToast("👏 Task checked off!");
      } else {
        showToast("Task marked as active");
      }
    } catch (err) {
      console.error("Error toggling completion:", err);
      showToast("Error: Could not update task", "error");
    }
  };

  // Update a task details
  const updateTask = async (id, updatedData) => {
    try {
      setError("");
      const res = await axios.put(`${API}/${id}`, updatedData);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? res.data : t))
      );
      setEditTask(null);
      showToast("✏️ Task updated successfully!");
    } catch (err) {
      console.error("Error updating task:", err);
      showToast("Error: Could not save changes", "error");
    }
  };

  // Clear all filters
  const handleResetFilters = () => {
    setFilterPriority("all");
    setFilterCategory("all");
    setSearchQuery("");
    showToast("Filters reset", "info");
  };

  return (
    <div className="dashboard-container">
      {/* Toast Notification */}
      <div className={`toast-notification ${toast.show ? "show" : ""} ${toast.type}`}>
        {toast.message}
      </div>

      {/* Header Bar */}
      <header className="dashboard-header">
        <div className="header-branding">
          <div className="logo-icon-wrapper">
            <Sparkles size={24} className="logo-sparkle" />
          </div>
          <div>
            <h1>TaskFlow</h1>
            <p className="subtitle">Premium Task Management</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title..."
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
              &times;
            </button>
          )}
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="dashboard-grid">
        {/* Left Panel: Statistics & Form */}
        <section className="dashboard-sidebar">
          {/* Statistics Dashboard */}
          <TaskStats
            tasks={tasks}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
          />

          {/* Form Card */}
          <TodoForm
            addTask={addTask}
            editTask={editTask}
            updateTask={updateTask}
            cancelEdit={() => setEditTask(null)}
          />
        </section>

        {/* Right Panel: Filters & Task Cards */}
        <section className="dashboard-content">
          {/* Advanced Filter Toolbar */}
          <div className="filter-toolbar">
            <div className="toolbar-header">
              <div className="toolbar-title">
                <SlidersHorizontal size={16} />
                <span>Filters & Controls</span>
              </div>
              {(filterPriority !== "all" || filterCategory !== "all" || searchQuery) && (
                <button className="btn-reset-filters" onClick={handleResetFilters}>
                  Clear Filters
                </button>
              )}
            </div>

            <div className="toolbar-selectors">
              {/* Priority Select */}
              <div className="toolbar-select-group">
                <label>Priority</label>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">All Priorities</option>
                  <option value="high">High Only</option>
                  <option value="medium">Medium Only</option>
                  <option value="low">Low Only</option>
                </select>
              </div>

              {/* Category Select */}
              <div className="toolbar-select-group">
                <label>Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="toolbar-select"
                >
                  <option value="all">All Categories</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="shopping">Shopping</option>
                  <option value="fitness">Fitness</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={20} className="error-icon" />
              <div className="error-text">
                <p>{error}</p>
                <button className="btn-retry" onClick={getTasks}>
                  <RefreshCw size={14} style={{ marginRight: 4 }} /> Retry Connection
                </button>
              </div>
            </div>
          )}

          {/* Loader or Task Cards */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Syncing with database...</p>
            </div>
          ) : (
            <TodoList
              tasks={tasks}
              deleteTask={deleteTask}
              toggleComplete={toggleComplete}
              setEditTask={setEditTask}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;