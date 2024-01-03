import {renderProjectTab, renderTaskListContainer} from "./domManipulationProject";
import {Task} from "../Tasks/task";

// Class definition
class Project {
    constructor(title, tasks = []) {
        this.title = title;
        this.tasks = tasks;
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(task) {
        this.tasks.splice(this.tasks.indexOf(task), 1);
        updateLocalStorage();
    }

    getTitle() {
        return this.title;
    }
}

let projectList

const defaultProject =
    new Project('Default', [
        {
            "title": "Task Template 1",
            "description": "This is a template for your first task. Replace this text with your task description.",
            "dueDate": "2026-12-29",
            "priority": "3",
            "completed": false
        },
        {
            "title": "Task Template 2",
            "description": "This is a template for your second task. Replace this text with your task description.",
            "dueDate": "2026-12-31",
            "priority": "1",
            "completed": false
        },
    ])

// Add the default project to the project list
try {
    const loadedProjects = JSON.parse(localStorage.getItem('projectList'));
    if (loadedProjects && loadedProjects.length > 0) {
        projectList = loadedProjects.map(project => {
            const newProject = new Project(project.title);
            newProject.tasks = project.tasks.map(task => new Task(task.title, task.description, task.dueDate, task.priority));
            return newProject;
        });
    } else {
        projectList = [defaultProject];
    }
} catch {
    projectList = [defaultProject];
}

const updateLocalStorage = () => {
    localStorage.setItem('projectList', JSON.stringify(projectList));
}

const addProjectToList = (title) => {
    const project = new Project(title)
    projectList.push(project)
}

const checkProjectExists = (title, projectList) => {
    return projectList.some(project => project.getTitle() === title);
}


// Export statements
export {projectList, addProjectToList, checkProjectExists, updateLocalStorage}