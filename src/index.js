import './style.css'
import {Project, closeProjectCreation, openProjectCreation} from './project'
import {Task, openTaskCreation, closeTaskCreation} from "./task";

//Project and task lists
const projectList = [];
const taskList = [];

//Initiating DOM elements
const content = document.querySelector('#content');
const projectTabsContainer = document.querySelector('#project-tabs-container')
const createProjectButton = document.querySelector('#create-project-button')
const closeProjectButton = document.querySelector("#close-project-form-button")
const projectForm = document.querySelector('#project-form-container')
const taskContainer = document.querySelector('#task-list-container')
const closeTaskButton = document.querySelector('#close-task-form-button')
const taskForm = document.querySelector('#task-form-container')


//Open close project form
createProjectButton.addEventListener('click', () => {
    openProjectCreation()
})
closeProjectButton.addEventListener('click', () => {
    closeProjectCreation()
})

//Adding a project to project List
const addProjectToList = (title) => {
    const project = new Project(title)
    projectList.push(project)
}

//create Project
const createProject = (e) => {
    e.preventDefault()
    let title = document.getElementById('title').value

    addProjectToList(title)
    closeProjectCreation()
    projectList.forEach(project =>
        console.log(project.title)
    )
    projectTabsContainer.innerHTML = ""
    renderAllProjectTasks(projectList)
}

//Submit project
projectForm.addEventListener('submit', createProject)

const renderProjectTab = (project) => {
    const tab = document.createElement('div')
    tab.textContent = project.title
    projectTabsContainer.appendChild(tab)

    tab.addEventListener('click', () => {
        renderTaskListContainer()
    })
}

const renderAllProjectTasks = (projectList) => {
    projectList.forEach(project =>
        renderProjectTab(project)
    )
}


const renderTaskListContainer = () => {
    if (taskList.length > 1) {
    } else {
        const emptyDiv = document.createElement('div')
        emptyDiv.textContent = "Please add a task"
        taskContainer.appendChild(emptyDiv)
    }

    const addTaskButton = document.createElement('button')
    addTaskButton.textContent = 'Add Task'

    taskContainer.appendChild(addTaskButton)
    addTaskButton.addEventListener('click', () => {
        openTaskCreation()
    })
    closeTaskButton.addEventListener('click', () => {
        closeTaskCreation()
    })
}

const renderTaskCard = (title, description, dueDate, priority) => {
    const taskCardDiv = document.createElement('div')

    const titleDiv = document.createElement('div')
    titleDiv.textContent = title

    const descriptionDiv = document.createElement('div')
    descriptionDiv.textContent = description

    const dueDateDiv = document.createElement('div')
    dueDateDiv.textContent = dueDate

    const priorityDiv = document.createElement('div')
    priorityDiv.textContent = priority

    taskCardDiv.appendChild(titleDiv)
    taskCardDiv.appendChild(descriptionDiv)
    taskCardDiv.appendChild(dueDateDiv)
    taskCardDiv.appendChild(priorityDiv)

    return taskCardDiv
}


const addTaskToList = (title, description, dueDate = "1/1/2023", priority = 1) => {
    const task = new Task(title, description, dueDate, priority)
    taskList.push(task)
}

const createTask = (e) => {
    e.preventDefault()
    const title = document.querySelector('#taskTitle').value
    const description = document.querySelector('#taskDescription').value
    addTaskToList(title, description)
    closeTaskCreation()
    taskList.forEach(task =>
        console.log(task.title, task.description, task.dueDate, task.priority)
    )
    taskContainer.innerHTML = ""
    taskList.forEach(task =>
        renderTaskCard(task.title, task.description, task.dueDate, task.priority)
    )
    taskContainer.appendChild(renderTaskCard())
}

taskForm.addEventListener('submit', createTask)