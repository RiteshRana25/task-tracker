import { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./Components/TaskForm";
import TaskList from "./Components/TaskList";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

const fetchTasks = async () => {
  try {
    const res = await axios.get("https://task-tracker-backend-flax.vercel.app/tasks");
    setTasks(res.data);
  } catch (error) {
    console.error(error);
    alert("Failed to fetch tasks. Please try again.");
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Task Tracker</h1>
      </div>

      <TaskForm refresh={fetchTasks} />
      <TaskList tasks={tasks} refresh={fetchTasks} />
    </div>
  );
}

export default App;
