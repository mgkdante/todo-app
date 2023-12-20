export class Task{
    constructor(title, description, dueDate, priority)
    {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

export const openTaskCreation = () => {
    document.querySelector('#task-form-container').style.display = 'block'
}

export const closeTaskCreation = () => {
    document.querySelector('#task-form-container').style.display = 'none'
}