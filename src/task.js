import { closeProjectCreation } from './project'

export class Task{
    constructor(title, description, dueDate, priority)
    {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.completed = false
    }
}

export const openTaskCreation = () => {
    closeProjectCreation()
    document.querySelector('#task-form-container').style.display = 'block'
}

export const closeTaskCreation = () => {
    document.querySelector('#task-form-container').style.display = 'none'
}