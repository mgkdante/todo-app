import './style.css'
import {
    closeProjectButton,
    closeProjectCreation,
    createProject,
    createProjectButton,
    openProjectCreation,
    projectForm,
    renderProjectTab,
} from "./Projects/domManipulationProject";

import {
    createTask,
    renderTaskListContainer,
    taskForm,
} from "./Tasks/domManipulationTask";
import {defaultProject} from "./Projects/project";


//Open close project form
createProjectButton.addEventListener('click', () => {
    openProjectCreation(projectForm)
})
closeProjectButton.addEventListener('click', () => {
    closeProjectCreation(projectForm)
})


//Submit project
projectForm.addEventListener('submit', createProject)


// Render the default project
renderProjectTab(defaultProject);
renderTaskListContainer(defaultProject)

taskForm.addEventListener('submit', createTask)


