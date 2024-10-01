import { useState, useEffect } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Task {
  id: number;
  text: string;
  projectId: number;
}

interface Project {
  id: number;
  name: string;
}

const AppContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledButton = styled(Button)`
  && {
    margin-top: 1rem;
  }
`;

function App() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>("tasks", {
    defaultValue: [],
  });
  const [projects, setProjects] = useLocalStorageState<Project[]>("projects", {
    defaultValue: [],
  });
  const [newTask, setNewTask] = useState("");
  const [newProject, setNewProject] = useState("");
  const [selectedProject, setSelectedProject] = useState<number | "">("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (projects.length === 0) {
      const initialProjects: Project[] = [
        { id: 1, name: "Project A" },
        { id: 2, name: "Project B" },
      ];
      setProjects(initialProjects);
    }
  }, [projects, setProjects]);

  const handleAddTask = () => {
    if (newTask.trim() !== "" && selectedProject !== "") {
      setTasks([
        ...tasks,
        { id: Date.now(), text: newTask.trim(), projectId: selectedProject as number },
      ]);
      setNewTask("");
    }
  };

  const handleAddProject = () => {
    if (newProject.trim() !== "") {
      setProjects([
        ...projects,
        { id: Date.now(), name: newProject.trim() },
      ]);
      setNewProject("");
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleEditTask = (id: number) => {
    setEditingId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditText(taskToEdit.text);
    }
  };

  const handleUpdateTask = (id: number) => {
    if (editText.trim() !== "") {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, text: editText.trim() } : task
        )
      );
    }
    setEditingId(null);
    setEditText("");
  };

  return (
    <AppContainer>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Management
      </Typography>

      {/* Add Project Section */}
      <TextField
        fullWidth
        variant="outlined"
        label="New Project"
        value={newProject}
        onChange={(e) => setNewProject(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddProject()}
      />
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddProject}
      >
        Add Project
      </StyledButton>

      {/* Add Task Section */}
      <TextField
        fullWidth
        variant="outlined"
        label="New Task"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        style={{ marginTop: "1rem" }}
      />
      <FormControl fullWidth style={{ marginTop: "1rem" }}>
        <InputLabel>Select Project</InputLabel>
        <Select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value as number)}
        >
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <StyledButton
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddTask}
      >
        Add Task
      </StyledButton>

      {/* Task List */}
      <List>
        {tasks.map((task) => (
          <ListItem key={task.id} dense>
            {editingId === task.id ? (
              <TextField
                fullWidth
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={() => handleUpdateTask(task.id)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleUpdateTask(task.id)
                }
                autoFocus
              />
            ) : (
              <ListItemText
                primary={task.text}
                secondary={`Project: ${projects.find(p => p.id === task.projectId)?.name}`}
              />
            )}
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEditTask(task.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTask(task.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </AppContainer>
  );
}

export default App;