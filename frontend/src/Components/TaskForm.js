import { useState } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import "./TaskForm.css";

export default function TaskForm({ refresh }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: null,
  });

  const isValid = task.title && task.dueDate;

  const submit = async () => {
    try {
      await axios.post(
        "https://task-tracker-backend-flax.vercel.app/tasks",
        task
      );
      setTask({ title: "", description: "", priority: "Low", dueDate: null });
      refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="task-form">
      <Typography
        variant="h6"
        fontWeight={600}
        fontFamily="Fredoka One, cursive"
        fontSize="1.25rem"
        color="#51f63bff"
        sx={{
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          marginBottom: "1rem",
        }}
      >
        Add New Task
      </Typography>

      <TextField
        fullWidth
        label="Task Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
      />

      <TextField
        fullWidth
        label="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
      />

      <TextField
        select
        fullWidth
        label="Priority"
        value={task.priority}
        onChange={(e) => setTask({ ...task, priority: e.target.value })}
      >
        <MenuItem value="Low">Low</MenuItem>
        <MenuItem value="Medium">Medium</MenuItem>
        <MenuItem value="High">High</MenuItem>
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Due Date"
          value={task.dueDate}
          minDate={new Date()}
          onChange={(newValue) => setTask({ ...task, dueDate: newValue })}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />
      </LocalizationProvider>

      <Button
        variant="contained"
        size="large"
        disabled={!isValid}
        onClick={submit}
      >
        Add Task
      </Button>
    </div>
  );
}
