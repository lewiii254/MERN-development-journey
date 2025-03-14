import React, { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./styles/app.css";

function App() {
  const [tasks, setTasks] = useState([]);

  // ✅ Load tasks from localStorage on first render
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // ✅ Persist tasks to localStorage on updates
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ Add a new task
  function addTask(text) {
    if (!text.trim()) return;
    const newTask = { id: Date.now(), text, completed: false, createdAt: new Date().toLocaleString() };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  // ✅ Delete a task
  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  // ✅ Toggle task completion
  function toggleComplete(id) {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return (
    <div className="container">
      <h1>✅ Task Manager PLP</h1>
      <TaskInput addTask={addTask} />
      <TaskList tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} />
    </div>
  );
}

export default App;