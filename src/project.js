import { closeTaskCreation } from './task'

export class Project {
    constructor(title) {
        this.title = title;
        this.tasks = [];
    }

    addTask(task) {
        this.tasks.push(task);
    }

    removeTask(task) {
        this.tasks.splice(this.tasks.indexOf(task), 1);
    }

    getTasks() {
        return this.tasks;
    }

    getTitle() {
        return this.title;
    }
}

//Project creation open and closing form
export const openProjectCreation = () => {
    closeTaskCreation()
    document.querySelector('#project-form-container').style.display = 'block'
}

export const closeProjectCreation = () => {
    document.querySelector('#project-form-container').style.display = 'none'
}