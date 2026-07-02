const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/Task");

// In-memory fallback database
let inMemoryTasks = [
  {
    _id: "mock-1",
    title: "🚀 Welcome to TaskFlow!",
    description: "This is a sample task. You are running in in-memory mode because MongoDB is offline. You can still create, edit, toggle, and delete tasks!",
    completed: false,
    priority: "high",
    category: "work",
    dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    createdAt: new Date().toISOString()
  },
  {
    _id: "mock-2",
    title: "💡 Try adding a task",
    description: "Use the creation form on the left. Set a priority and category to see the tags in action.",
    completed: false,
    priority: "medium",
    category: "personal",
    dueDate: null,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: "mock-3",
    title: "🎉 Completed Task example",
    description: "This task is already completed. Click the checkbox to mark it active again.",
    completed: true,
    priority: "low",
    category: "fitness",
    dueDate: null,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

// Helper to check if Mongoose is connected
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// @route   GET /api/tasks
// @desc    Get all tasks
router.get("/", async (req, res, next) => {
  try {
    const { status, priority, category, search } = req.query;

    if (isConnected()) {
      let query = {};
      if (status === "completed") query.completed = true;
      else if (status === "active") query.completed = false;
      
      if (priority && priority !== "all") query.priority = priority;
      if (category && category !== "all") query.category = category;
      if (search) query.title = { $regex: search, $options: "i" };

      const tasks = await Task.find(query).sort({ createdAt: -1 });
      return res.json(tasks);
    } else {
      // In-Memory search & filter logic
      let filtered = [...inMemoryTasks];

      if (status === "completed") {
        filtered = filtered.filter((t) => t.completed);
      } else if (status === "active") {
        filtered = filtered.filter((t) => !t.completed);
      }

      if (priority && priority !== "all") {
        filtered = filtered.filter((t) => t.priority === priority);
      }

      if (category && category !== "all") {
        filtered = filtered.filter((t) => t.category === category);
      }

      if (search) {
        const queryStr = search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(queryStr) ||
            (t.description && t.description.toLowerCase().includes(queryStr))
        );
      }

      // Sort by createdAt desc
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return res.json(filtered);
    }
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
router.post("/", async (req, res, next) => {
  try {
    const { title, description, priority, category, dueDate } = req.body;

    if (isConnected()) {
      const newTask = new Task({
        title,
        description,
        priority,
        category,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      });
      const savedTask = await newTask.save();
      return res.status(201).json(savedTask);
    } else {
      const newTask = {
        _id: "mock-" + Date.now(),
        title,
        description: description || "",
        completed: false,
        priority: priority || "medium",
        category: category || "personal",
        dueDate: dueDate || null,
        createdAt: new Date().toISOString()
      };
      inMemoryTasks.unshift(newTask);
      return res.status(201).json(newTask);
    }
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put("/:id", async (req, res, next) => {
  try {
    const { title, description, completed, priority, category, dueDate } = req.body;

    if (isConnected()) {
      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;
      if (priority !== undefined) updateData.priority = priority;
      if (category !== undefined) updateData.category = category;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json(updatedTask);
    } else {
      const index = inMemoryTasks.findIndex((t) => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
      }

      const task = inMemoryTasks[index];
      const updatedTask = {
        ...task,
        title: title !== undefined ? title : task.title,
        description: description !== undefined ? description : task.description,
        completed: completed !== undefined ? completed : task.completed,
        priority: priority !== undefined ? priority : task.priority,
        category: category !== undefined ? category : task.category,
        dueDate: dueDate !== undefined ? dueDate : task.dueDate,
      };

      inMemoryTasks[index] = updatedTask;
      return res.json(updatedTask);
    }
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete("/:id", async (req, res, next) => {
  try {
    if (isConnected()) {
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
      return res.json({ message: "Task deleted successfully", id: req.params.id });
    } else {
      const index = inMemoryTasks.findIndex((t) => t._id === req.params.id);
      if (index === -1) {
        return res.status(404).json({ message: "Task not found" });
      }
      inMemoryTasks.splice(index, 1);
      return res.json({ message: "Task deleted successfully", id: req.params.id });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
