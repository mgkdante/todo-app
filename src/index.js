import './style.css'
import {Project, closeProjectCreation, openProjectCreation} from './project'
import {Task, openTaskCreation, closeTaskCreation} from "./task";
import {isPast, isValid, parseISO} from 'date-fns'
//Project and task lists
const projectList = [];

//Initiating DOM elements
const projectTabsContainer = document.querySelector('#project-tabs-container')
const createProjectButton = document.querySelector('#create-project-button')
const closeProjectButton = document.querySelector("#close-project-form-button")
const projectForm = document.querySelector('#project-form-container')
const taskContainer = document.querySelector('#task-list-container')
const closeTaskButton = document.querySelector('#close-task-form-button')
const taskForm = document.querySelector('#task-form-container')

let currentProject = null

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

    const projectExists = projectList.some(project => project.getTitle() === title)
    if (projectExists) {
        alert('A project with this title already exists')
        return
    }

    addProjectToList(title)
    closeProjectCreation()
    projectTabsContainer.innerHTML = ""
    projectTabsContainer.appendChild(createProjectButton)
    renderAllProjectTasks(projectList)
    // Render an empty task list for the new project
    renderTaskListContainer(projectList[projectList.length - 1])

}

//Submit project
projectForm.addEventListener('submit', createProject)

const renderProjectTab = (project) => {
    const tab = document.createElement('div')
    tab.textContent = project.title
    tab.classList.add('project-card')
    projectTabsContainer.appendChild(tab)

    tab.addEventListener('click', () => {
        taskContainer.innerHTML = ""
        renderTaskListContainer(project)
    })
}

const renderAllProjectTasks = (projectList) => {
    projectList.forEach(project =>
        renderProjectTab(project)
    )
}


const renderTaskListContainer = (project) => {
    currentProject = project
    taskContainer.innerHTML = ""
    if (currentProject.tasks.length >= 1) {
        currentProject.tasks.forEach(task => {
                taskContainer.appendChild(renderTaskCard(task))
            }
        )
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

const renderTaskCard = (task) => {
    const taskCardDiv = document.createElement('div')
    taskCardDiv.classList.add('task-card')

    const titleDiv = document.createElement('div')
    titleDiv.textContent = task.title
    titleDiv.classList.add('task-title')

    const descriptionDiv = document.createElement('div')
    descriptionDiv.textContent = task.description
    descriptionDiv.classList.add('task-description')

    const dueDateDiv = document.createElement('div')
    dueDateDiv.textContent = task.dueDate
    dueDateDiv.classList.add('task-due-date')

    const priorityDiv = document.createElement('div')
    priorityDiv.textContent = task.priority
    priorityDiv.classList.add('task-priority')


    const completedButton = document.createElement('input')
    completedButton.classList.add('task-status')
    completedButton.type = 'checkbox'
    completedButton.checked = task.completed
    completedButton.addEventListener('change', () => {
        task.completed = completedButton.checked
        if (task.completed) {
            taskCardDiv.style.opacity = '0.5'
            taskCardDiv.style.textDecoration = 'line-through'
        } else {
            taskCardDiv.style.opacity = '1'
            taskCardDiv.style.textDecoration = 'none'
        }
    })

    const deleteButton = document.createElement('Button')
    deleteButton.textContent = 'Delete Task'
    deleteButton.classList.add('task-delete')

    deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            currentProject.removeTask(task);
            renderTaskListContainer(currentProject);
        }
    })

    taskCardDiv.appendChild(titleDiv)
    taskCardDiv.appendChild(descriptionDiv)
    taskCardDiv.appendChild(dueDateDiv)
    taskCardDiv.appendChild(priorityDiv)
    taskCardDiv.appendChild(completedButton)
    taskCardDiv.appendChild(deleteButton)


    if (isPast(new Date(task.dueDate)) && task.completed === false) {
        // Void the task
        taskCardDiv.style.opacity = '0.5'
        taskCardDiv.style.textDecoration = 'line-through'
        taskCardDiv.style.textDecorationColor = 'red'

    }

    return taskCardDiv
}

const validateDate = (dateString) => {
    const date = parseISO(dateString)
    return isValid(date)
}
const addTaskToList = (title, description, dueDate, priority = 3) => {
    const task = new Task(title, description, dueDate, priority)
    currentProject.addTask(task)
}

const createTask = (e) => {
    e.preventDefault()
    const title = document.querySelector('#taskTitle').value
    const description = document.querySelector('#taskDescription').value
    const priority = document.querySelector('#taskPriority').value
    const dueDate = document.querySelector('#taskDueDate').value


    if (!validateDate(dueDate)) {
        alert('Please enter a valid due date')
        return
    }

    addTaskToList(title, description, dueDate, priority)
    closeTaskCreation()
    taskContainer.innerHTML = ""
    currentProject.getTasks().forEach(task =>
        taskContainer.appendChild(renderTaskCard(task))
    )
    renderTaskListContainer(currentProject)

    // Clear the form
    document.querySelector('#taskTitle').value = ''
    document.querySelector('#taskDescription').value = ''
    document.querySelector('#taskPriority').value = '1'
    document.querySelector('#taskDueDate').value = ''

}

taskForm.addEventListener('submit', createTask)