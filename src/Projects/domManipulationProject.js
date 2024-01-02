import {closeTaskCreation} from "../Tasks/task";
import {addProjectToList, projectList, checkProjectExists} from "./project";
import {renderTaskListContainer, taskContainer} from "../Tasks/domManipulationTask";

//Projects DOM elements
const projectTabsContainer = document.querySelector('#project-tabs-container')
const createProjectButton = document.querySelector('#create-project-button')
const closeProjectButton = document.querySelector("#close-project-form-button")
const projectForm = document.querySelector('#project-form-container')
const projectTitle = document.querySelector('#title')


const openProjectCreation = (projectForm) => {
    closeTaskCreation()
    projectForm.style.display = 'block'
}

const closeProjectCreation = (projectForm) => {
    projectForm.style.display = 'none'
}

const getTitleFromInput = () => {
    return projectTitle.value;
}

const showProjectExistsAlert = () => {
    alert('A project with this title already exists');
}

const resetProjectTabsContainer = (projectTabsContainer, createProjectButton) => {
    projectTabsContainer.innerHTML = "";
    projectTabsContainer.appendChild(createProjectButton);
}


const renderNewProject = (projectList) => {
    renderAllProjectTasks(projectList);
    renderTaskListContainer(projectList[projectList.length - 1]);
}

const createProject = (e) => {
    e.preventDefault()
    let title = getTitleFromInput()

    const projectExists = checkProjectExists(title, projectList)
    if (projectExists) {
        showProjectExistsAlert()
        return
    }

    addProjectToList(title)
    closeProjectCreation()
    resetProjectTabsContainer(projectTabsContainer, createProjectButton)
    renderNewProject(projectList)
}

const createProjectTab = (project) => {
    const tab = document.createElement('div');
    tab.textContent = project.title;
    tab.classList.add('project-card');
    return tab;
}

const addProjectTabToContainer = (tab, projectTabsContainer) => {
    projectTabsContainer.appendChild(tab);
}

const addTabClickListener = (tab, project, taskContainer, renderTaskListContainer) => {
    tab.addEventListener('click', () => {
        taskContainer.innerHTML = "";
        renderTaskListContainer(project);
    });
}

const renderProjectTab = (project) => {
    const tab = createProjectTab(project);
    addProjectTabToContainer(tab, projectTabsContainer);
    addTabClickListener(tab, project, taskContainer, renderTaskListContainer);
}

const renderAllProjectTasks = (projectList) => {
    projectList.forEach(project =>
        renderProjectTab(project)
    )
}


export {
    openProjectCreation,
    closeProjectCreation,
    createProject,
    createProjectButton,
    closeProjectButton,
    projectForm,
    renderProjectTab,
}