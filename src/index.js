import './style.css'

import {
    closeProjectButton,
    createOrEditProject,
    createProjectButton,
    toggleProjectCreation,
    projectForm,
    renderProjectTab,
} from "./Project/domManipulationProject";
import { projectList} from "./Project/project";

import {
    createOrEditTask,
    renderTaskListContainer,
    taskForm,
} from "./Tasks/domManipulationTask";

// Render the default project
projectList.forEach(project => {
    renderProjectTab(project);
    renderTaskListContainer(project);
});

// Event listeners for a project form
createProjectButton.addEventListener('click', () => {
    toggleProjectCreation(true)
});
closeProjectButton.addEventListener('click', () => {
    toggleProjectCreation(false)
});
projectForm.addEventListener('submit', createOrEditProject);

// Event listener for a task form
taskForm.addEventListener('submit', createOrEditTask);