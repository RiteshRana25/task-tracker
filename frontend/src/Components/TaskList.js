import { useState, useMemo } from "react";
import axios from "axios";
import "./TaskList.css";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import DoneIcon from "@mui/icons-material/Done";

export default function TaskList({ tasks, refresh }) {
  const [filter, setFilter] = useState({
    status: "All",
    priority: "All",
  });

  const funnyMessages = [
    "Zero tasks… are you secretly a robot? ",
    "Wow… nothing to do. Are you a productivity or just lazy?",
    "Congratulations! You’re officially a task-free ninja",
    "No tasks… maybe you’re busy watching YouTube",
    "Zero tasks. Are you scrolling Instagram again?",
    "No tasks here… probably watching memes somewhere",
    "No tasks… probably busy leveling up in your favorite game",
    "No tasks… maybe it’s time to get a job",
    "No tasks… perfect time to update your resume",
    "Nothing here… maybe you’re stuck in an infinite loop",
    "No tasks… maybe you’re leveling up on LeetCode",
  ];

  const [sortAsc, setSortAsc] = useState(true);

  const toggleStatus = async (task) => {
    try {
      await axios.put(
        `https://task-tracker-backend-flax.vercel.app/tasks/${task._id}`,
        {
          status: task.status === "Pending" ? "Completed" : "Pending",
        }
      );
      refresh();
    } catch {
      alert("Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `https://task-tracker-backend-flax.vercel.app/tasks/${id}`
      );
      refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task. Please try again.");
    }
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (filter.status !== "All") {
      filtered = filtered.filter((t) => t.status === filter.status);
    }

    if (filter.priority !== "All") {
      filtered = filtered.filter((t) => t.priority === filter.priority);
    }

    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
    filtered.sort((a, b) => {
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return sortAsc ? -priorityDiff : priorityDiff;
      return sortAsc
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate);
    });

    return filtered;
  }, [tasks, filter, sortAsc]);

  // ✅ ADDED (bug fix)
  const hasAnyTasks = tasks.length > 0;
  const hasFilteredTasks = filteredTasks.length > 0;

  return (
    <div className="task-list-wrapper">
      {tasks.length > 0 && (
        <div className="task-filter">
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter.status}
              label="Status"
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={filter.priority}
              label="Priority"
              onChange={(e) =>
                setFilter({ ...filter, priority: e.target.value })
              }
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <button className="sort-btn" onClick={() => setSortAsc(!sortAsc)}>
            {sortAsc ? "↑" : "↓"}
          </button>
        </div>
      )}

      {hasFilteredTasks ? (
        filteredTasks.map((task) => (
          <div key={task._id} className="task-card">
            <div className="task-info">
              <h3 className="task-title">{task.title}</h3>
              <p className="task-meta">
                <span
                  className={`task-badge ${
                    task.status === "Pending"
                      ? "badge-status-pending"
                      : "badge-status-completed"
                  }`}
                >
                  {task.status === "Pending" ? (
                    <HourglassBottomIcon fontSize="small" />
                  ) : (
                    <DoneIcon fontSize="small" />
                  )}
                  &nbsp; {task.status}
                </span>

                <span
                  className={`task-badge ${
                    task.priority === "High"
                      ? "badge-priority-high"
                      : task.priority === "Medium"
                      ? "badge-priority-medium"
                      : "badge-priority-low"
                  }`}
                >
                  {task.priority}
                </span>

                <span className="task-badge badge-date">
                  {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </p>
            </div>

            <div className="task-actions">
              <button className="task-btn" onClick={() => toggleStatus(task)}>
                {task.status === "Pending" ? "Mark Done" : "Reopen"}
              </button>

              <button
                className="task-btn delete"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : hasAnyTasks ? (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#888",
            fontSize: "1.2rem",
          }}
        >
          No tasks match the selected filters
        </p>
      ) : (
        <p
          style={{
            textAlign: "center",
            marginTop: "1rem",
            fontFamily: "'Fredoka One', 'Comic Neue', cursive",
            fontSize: "1.2rem",
            color: "#ff6f61",
          }}
        >
          {funnyMessages[Math.floor(Math.random() * funnyMessages.length)]}
        </p>
      )}
    </div>
  );
}
