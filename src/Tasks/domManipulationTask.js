import {isPast, isValid, parseISO} from "date-fns";
import {toggleProjectCreation} from "../Project/domManipulationProject";
import {Task} from "./task";
import {updateLocalStorage} from "../Project/project";

// Function to select DOM elements
const selectElement = (selector) => document.querySelector(selector);

//Tasks DOM elements
const taskContainer = selectElement('#task-list-container');
const closeTaskButton = selectElement('#close-task-form-button');
const taskForm = selectElement('#task-form-container');


let currentProject = null;

const setCurrentProject = (project) => {
    currentProject = project;
}

const toggleTaskCreation = (isOpen) => {
    toggleProjectCreation(false);
    taskForm.style.display = isOpen ? 'block' : 'none';
}

const clearTaskContainer = () => {
    taskContainer.innerHTML = "";
}

const renderTasks = (renderTaskCard) => {
    currentProject.tasks.forEach(task => {
        taskContainer.appendChild(renderTaskCard(task));
    });
}

const showEmptyTaskMessage = () => {
    const emptyTaskMessage = createElement('div', 'No tasks to display', 'empty-message');
    taskContainer.appendChild(emptyTaskMessage);
}

const createAddTaskButton = () => {
    const addTaskButton = createElement('button', 'Add Task', 'add-task-button');
    taskContainer.appendChild(addTaskButton);
    return addTaskButton;
}

const addTaskButtonClickListener = (addTaskButton) => {
    addTaskButton.addEventListener('click', () => {
        toggleTaskCreation(true);
    });
    closeTaskButton.addEventListener('click', () => {
        toggleTaskCreation(false);
    });
}

const renderTaskListContainer = (project) => {
    setCurrentProject(project);

    clearTaskContainer();
    if (currentProject.tasks.length >= 1) {
        renderTasks(renderTaskCard);
    } else {
        showEmptyTaskMessage();
    }
    // Append the "Add Task" button before clearing the taskContainer
    const addTaskButton = createAddTaskButton();
    addTaskButtonClickListener(addTaskButton);
}

// Function to create a DOM element with specific properties
const createElement = (type, textContent, className) => {
    const element = document.createElement(type);
    element.textContent = textContent;
    if (className) element.classList.add(className);
    return element;

}

const priorityToString = (priority) => {
    switch (priority) {
        case '1':
            return 'Low';
        case '2':
            return 'Medium';
        case '3':
            return 'High';
        default:
            return 'Unknown';
    }
}
const getTaskFormData = () => {
    const title = selectElement('#taskTitle').value;
    const description = selectElement('#taskDescription').value;
    const priority = selectElement('#taskPriority').value;
    const dueDate = selectElement('#taskDueDate').value;
    return {title, description, priority, dueDate};
}

const updateTask = (task, formData) => {
    task.title = formData.title;
    task.description = formData.description;
    task.priority = formData.priority;
    task.dueDate = formData.dueDate;
}

const createNewTask = (formData) => {
    addTaskToList(formData.title, formData.description, formData.dueDate, formData.priority);
}

const createOrEditTask = (e, isEdit = false, taskToEdit = null) => {
    e.preventDefault()
    const formData = getTaskFormData();

    if (!validateDate(formData.dueDate)) {
        alert('Please enter a valid due date');
        return;
    }

    if (isEdit && taskToEdit) {
        updateTask(taskToEdit, formData);
    } else {
        createNewTask(formData);
    }

    updateLocalStorage();

    toggleTaskCreation(false);
    renderTaskListContainer(currentProject); // Re-render the task list, including the "Add Task" button
    resetForm();
}

const createTaskCardElements = (task) => {
    const taskCardDiv = createElement('div', '', 'task-card');
    const firstLineTaskCard = createElement('div', '', 'first-line-task');
    const titleDiv = createElement('div', task.title, 'task-title');
    const completedButton = document.createElement('input');
    completedButton.classList.add('task-status');
    completedButton.type = 'checkbox';

    const descriptionLabel = createElement('div', 'Description:', 'task-description-label');
    const descriptionDiv = createElement('div', task.description, 'task-description');

    const dueDateLabel = createElement('div', 'Due Date:', 'task-due-date-label');
    const dueDateDiv = createElement('div', task.dueDate, 'task-due-date');

    const priorityLabel = createElement('div', 'Priority:', 'task-priority-label');
    const priorityDiv = createElement('div', priorityToString(task.priority), 'task-priority');

    const lastLineTaskCard = createElement('div', '', 'last-line-task');
    const editButton = createElement('button', 'Edit Task', 'task-edit');
    const deleteButton = createElement('button', 'Delete Task', 'task-delete');

    return {
        taskCardDiv,
        firstLineTaskCard,
        titleDiv,
        completedButton,
        descriptionLabel,
        descriptionDiv,
        dueDateLabel,
        dueDateDiv,
        priorityLabel,
        priorityDiv,
        lastLineTaskCard,
        editButton,
        deleteButton
    };
}

const addTaskCardEventListeners = (task, taskCardDiv, completedButton, editButton, deleteButton) => {
    completedButton.addEventListener('change', () => {
        task.completed = completedButton.checked;
        taskCardDiv.style.opacity = task.completed ? '0.5' : '1';
        taskCardDiv.style.textDecoration = task.completed ? 'line-through' : 'none';
    });
    editButton.addEventListener('click', () => {
        toggleTaskCreation(true);
        selectElement('#task-creation-edit-button').textContent = 'Edit Task';
        selectElement('#task-form-title').textContent = 'Edit Task';
        selectElement('#taskTitle').value = task.title;
        selectElement('#taskDescription').value = task.description;
        selectElement('#taskPriority').value = task.priority;
        selectElement('#taskDueDate').value = task.dueDate;
        selectElement('#task-creation-edit-button').addEventListener('click', (e) => {
            createOrEditTask(e, true, task);
        });
    });
    deleteButton.addEventListener('click', () => {
        const confirmDelete = confirm('Are you sure you want to delete this task?');
        if (confirmDelete) {
            currentProject.removeTask(task);
            renderTaskListContainer(currentProject);
        }
    });
}

const styleTaskCardIfPastDue = (task, taskCardDiv) => {
    if (isPast(new Date(task.dueDate)) && !task.completed) {
        taskCardDiv.style.opacity = '0.5';
        taskCardDiv.style.textDecoration = 'line-through';
        taskCardDiv.style.textDecorationColor = 'red';
    }
}

const renderTaskCard = (task) => {
    const {
        taskCardDiv,
        firstLineTaskCard,
        titleDiv,
        completedButton,
        descriptionLabel,
        descriptionDiv,
        dueDateLabel,
        dueDateDiv,
        priorityLabel,
        priorityDiv,
        lastLineTaskCard,
        editButton,
        deleteButton
    } = createTaskCardElements(task);
    addTaskCardEventListeners(task, taskCardDiv, completedButton, editButton, deleteButton);
    styleTaskCardIfPastDue(task, taskCardDiv);

    firstLineTaskCard.appendChild(titleDiv);
    firstLineTaskCard.appendChild(completedButton);
    taskCardDiv.appendChild(firstLineTaskCard);
    taskCardDiv.appendChild(descriptionLabel);
    taskCardDiv.appendChild(descriptionDiv);
    taskCardDiv.appendChild(dueDateLabel);
    taskCardDiv.appendChild(dueDateDiv);
    taskCardDiv.appendChild(priorityLabel);
    taskCardDiv.appendChild(priorityDiv);
    lastLineTaskCard.appendChild(editButton);
    lastLineTaskCard.appendChild(deleteButton);
    taskCardDiv.appendChild(lastLineTaskCard);

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

const resetForm = () => {
    selectElement('#taskTitle').value = '';
    selectElement('#taskDescription').value = '';
    selectElement('#taskPriority').value = '1';
    selectElement('#taskDueDate').value = '';
}


export {
    createOrEditTask,
    renderTaskListContainer,
    taskForm,
    taskContainer,
    toggleTaskCreation as closeTaskCreation
}