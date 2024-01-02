import {isPast, isValid, parseISO} from "date-fns";
import {closeProjectCreation} from "../Projects/domManipulationProject";

//Tasks DOM elements
const taskContainer = document.querySelector('#task-list-container')
const closeTaskButton = document.querySelector('#close-task-form-button')
const taskForm = document.querySelector('#task-form-container')

let currentProject = null

const setCurrentProject = (project) => {
    currentProject = project;
}

const openTaskCreation = () => {
    closeProjectCreation()
    document.querySelector('#task-form-container').style.display = 'block'
}

const closeTaskCreation = () => {
    document.querySelector('#task-form-container').style.display = 'none'
}

const clearTaskContainer = (taskContainer) => {
    taskContainer.innerHTML = "";
}

const renderTasks = (currentProject, taskContainer, renderTaskCard) => {
    currentProject.tasks.forEach(task => {
        taskContainer.appendChild(renderTaskCard(task));
    });
}

const showEmptyTaskMessage = (taskContainer) => {
    const emptyDiv = document.createElement('div');
    emptyDiv.textContent = "Please add a task";
    taskContainer.appendChild(emptyDiv);
}

const createAddTaskButton = (taskContainer) => {
    const addTaskButton = document.createElement('button');
    addTaskButton.textContent = 'Add Task';
    taskContainer.appendChild(addTaskButton);
    return addTaskButton;
}

const addTaskButtonClickListener = (addTaskButton, openTaskCreation, closeTaskCreation) => {
    addTaskButton.addEventListener('click', () => {
        openTaskCreation();
    });
    closeTaskButton.addEventListener('click', () => {
        closeTaskCreation();
    });
}

const renderTaskListContainer = (project) => {
    setCurrentProject(project);
    clearTaskContainer(taskContainer);
    if (currentProject.tasks.length >= 1) {
        renderTasks(currentProject, taskContainer, renderTaskCard);
    } else {
        showEmptyTaskMessage(taskContainer);
    }
    const addTaskButton = createAddTaskButton(taskContainer);
    addTaskButtonClickListener(addTaskButton, openTaskCreation, closeTaskCreation);
}

//Task Creation
const createTaskCardDiv = () => {
    const taskCardDiv = document.createElement('div');
    taskCardDiv.classList.add('task-card');
    return taskCardDiv;
}

const createFirstLineTaskCard = () => {
    const firstLineTaskCard = document.createElement('div');
    firstLineTaskCard.classList.add('first-line-task');
    return firstLineTaskCard;
}

const createTitleDiv = (task) => {
    const titleDiv = document.createElement('div');
    titleDiv.textContent = task.title;
    titleDiv.classList.add('task-title');
    return titleDiv;
}

const createCompletedButton = (task, taskCardDiv) => {
    const completedButton = document.createElement('input');
    completedButton.classList.add('task-status');
    completedButton.type = 'checkbox';
    completedButton.checked = task.completed;
    completedButton.addEventListener('change', () => {
        task.completed = completedButton.checked;
        if (task.completed) {
            taskCardDiv.style.opacity = '0.5';
            taskCardDiv.style.textDecoration = 'line-through';
        } else {
            taskCardDiv.style.opacity = '1';
            taskCardDiv.style.textDecoration = 'none';
        }
    });
    return completedButton;
}

const createDescriptionDiv = (task) => {
    const descriptionDiv = document.createElement('div');
    descriptionDiv.textContent = task.description;
    descriptionDiv.classList.add('task-description');
    return descriptionDiv;
}

const createDueDateDiv = (task) => {
    const dueDateDiv = document.createElement('div');
    dueDateDiv.textContent = task.dueDate;
    dueDateDiv.classList.add('task-due-date');
    return dueDateDiv;
}

const createPriorityDiv = (task) => {
    const priorityDiv = document.createElement('div');
    priorityDiv.textContent = task.priority;
    priorityDiv.classList.add('task-priority');
    return priorityDiv;
}

const createDeleteButton = (task, currentProject, renderTaskListContainer) => {
    const deleteButton = document.createElement('Button');
    deleteButton.textContent = 'Delete Task';
    deleteButton.classList.add('task-delete');
    deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            currentProject.removeTask(task);
            renderTaskListContainer(currentProject);
        }
    });
    return deleteButton;
}

const voidTaskIfPastDue = (task, taskCardDiv) => {
    if (isPast(new Date(task.dueDate)) && task.completed === false) {
        taskCardDiv.style.opacity = '0.5';
        taskCardDiv.style.textDecoration = 'line-through';
        taskCardDiv.style.textDecorationColor = 'red';
    }
}

const renderTaskCard = (task, currentProject, renderTaskListContainer) => {
    const taskCardDiv = createTaskCardDiv();
    const firstLineTaskCard = createFirstLineTaskCard();
    const titleDiv = createTitleDiv(task);
    const completedButton = createCompletedButton(task, taskCardDiv);
    const descriptionDiv = createDescriptionDiv(task);
    const dueDateDiv = createDueDateDiv(task);
    const priorityDiv = createPriorityDiv(task);
    const deleteButton = createDeleteButton(task, currentProject, renderTaskListContainer);

    firstLineTaskCard.appendChild(titleDiv);
    firstLineTaskCard.appendChild(completedButton);

    taskCardDiv.appendChild(firstLineTaskCard);
    taskCardDiv.appendChild(descriptionDiv);
    taskCardDiv.appendChild(dueDateDiv);
    taskCardDiv.appendChild(priorityDiv);
    taskCardDiv.appendChild(deleteButton);

    voidTaskIfPastDue(task, taskCardDiv);

    return taskCardDiv;
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


export {
    createTask,
    renderTaskListContainer,
    taskForm,
    taskContainer
}