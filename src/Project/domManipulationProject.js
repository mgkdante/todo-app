import {addProjectToList, checkProjectExists, projectList} from "./project";
import {closeTaskCreation, renderTaskListContainer, taskContainer} from "../Tasks/domManipulationTask";

//Project DOM elements
const projectTabsContainer = document.querySelector('#project-tabs-container')
const projectCreation = document.querySelector('#project-creation')
const createProjectButton = document.querySelector('#create-project-button')
const closeProjectButton = document.querySelector("#close-project-form-button")
const projectForm = document.querySelector('#project-form-container')
const createEdit = document.querySelector('#create-edit-project-button')
const toggleProjectCreation = (isOpen) => {
    if (isOpen) {
        closeTaskCreation()
        projectForm.style.display = 'block'
    } else {
        projectForm.style.display = 'none'
    }

}

const getProjectFormData = () => {
    const title = document.querySelector('#title').value
    console.log(title)
    return {title}
}

const updateProject = (project, formData) => {
    project.title = formData.title
}

const createNewProject = (formData) => {
    addProjectToList(formData.title)
}

const createOrEditProject = (e, isEdit = false, projectToEdit = null) => {
    e.preventDefault()
    const formData = getProjectFormData()

    if (isEdit && projectToEdit) {
        if (checkProjectExists(formData.title, projectList)) {
            alert('A project with this title already exists')
            return
        } else {
            updateProject(projectToEdit, formData);
        }
    } else {
        if (checkProjectExists(formData, projectList)) {
            alert('A project with this title already exists')
            return
        } else {
            createNewProject(formData)
        }
    }

    toggleProjectCreation(false)
    projectTabsContainer.innerHTML = ""
    projectCreation.appendChild(createProjectButton)
    projectTabsContainer.appendChild(projectCreation)
    renderAllProjectTasks(projectList)
}

const createEditButton = () => {
    const editButton = document.createElement('Button')
    editButton.textContent = 'Edit Project'
    return editButton
}

const createDeleteButton = () => {
    const deleteButton = document.createElement('Button')
    deleteButton.classList.add('project-delete-button')
    deleteButton.textContent = 'Delete Project'
    return deleteButton
}


const addProjectCardEventListeners = (tab, project, editButton, deleteButton) => {
    tab.addEventListener('click', () => {
        taskContainer.innerHTML = ""
        renderTaskListContainer(project)
    })
    editButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the tab click event
        toggleProjectCreation(true)
        document.querySelector('#project-form-title').textContent = 'Edit Project'
        document.querySelector('#create-edit-project-button').textContent = 'Edit Project'
        document.querySelector('#title').value = project.title
        createEdit.addEventListener('click', (e) => {
            createOrEditProject(e, true, project)
        })
    })
    deleteButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent the tab click event
        const confirmDelete = confirm('Are you sure you want to delete this project?');
        if (confirmDelete) {
            project.tasks = []; // Delete all tasks under the project
            const index = projectList.indexOf(project);
            if (index > -1) {
                projectList.splice(index, 1);
            }
            projectCreation.appendChild(createProjectButton)
            projectTabsContainer.innerHTML = ""
            projectTabsContainer.appendChild(projectCreation)
            console.log(projectList)
            renderAllProjectTasks(projectList)
        }
    })
}

const renderProjectTab = (project) => {
    const tab = document.createElement('div')
    const lastLineTab = document.createElement('div')
    const editButton = createEditButton()
    const deleteButton = createDeleteButton()
    lastLineTab.classList.add('last-line-project')
    lastLineTab.appendChild(editButton)
    lastLineTab.appendChild(deleteButton)
    tab.textContent = project.title
    tab.classList.add('project-card')
    tab.appendChild(lastLineTab)
    addProjectCardEventListeners(tab, project, editButton, deleteButton)
    projectTabsContainer.appendChild(tab)
    project.tab = tab; // Store a reference to the project tab in the project object
}

const renderAllProjectTasks = (projectList) => {
    if (projectList.length === 0) {
        projectTabsContainer.innerHTML = ""
        const emptyMessage = document.createElement('div')
        emptyMessage.classList.add('empty-message')
        emptyMessage.textContent = "Add a project to get started"
        projectCreation.appendChild(createProjectButton)
        projectTabsContainer.appendChild(projectCreation)
        projectTabsContainer.appendChild(emptyMessage)
        taskContainer.innerHTML = "" // Clear the task container
        return
    }
    projectList.forEach(renderProjectTab)
}

export {
    toggleProjectCreation,
    createOrEditProject,
    createProjectButton,
    closeProjectButton,
    projectForm,
    renderProjectTab,
}