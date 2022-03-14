const addBtn = document.querySelector('.addDuty');
const taskInput = document.querySelector('.newDuty');
const todoList = document.querySelector('.todo-list');
const leftTasks = document.querySelector('.leftTasks');
const hideS = document.querySelector('.hideS');
const infoDuties = document.querySelector('.infoDuties');
const allDuties = document.querySelector('.allDuties');
const completedDuties = document.querySelector('.completedDuties');
const activeDuties = document.querySelector('.activeDuties');
const deleteCompletedDuties = document.querySelector('.deleteCompletedDuties');

let todoItems = [];
const tasks = !localStorage.tasks ? [] : JSON.parse(localStorage.getItem('tasks')); 
tasks.length > 0 ? infoDuties.classList.remove('infoDuties_hide') : infoDuties.classList.add('infoDuties_hide');

function Task(description){
    this.description = description;
    this.completed = false;
}

const createDuty = (task, index) => {
    return `
    <li ondblclick = "editTask(${index})" class = "todo-item ${task.completed ? 'checked' : ''}">
        <label class="isDone"><input onclick = "completeTask(${index})" type="checkbox" name=" "class="checkboxDone" ${task.completed ? 'checked' : ''}/><span class = "spanCompleted ${task.completed ? 'completed' : ''}"></span></label>
        ${task.description}
        <button onclick = "deleteTask(${index})" class="deleteDuty"><img src="icons/x.svg" alt="" class=""></button>
    </li>
    `
}

const countTasks = () =>{
    const completedTasks = tasks.filter(x => x.completed === true);
    const uncompletedTasks = tasks.filter(x => x.completed === false);
    completedTasks.length > 0 ? deleteCompletedDuties.classList.add('visible') : deleteCompletedDuties.classList.remove('visible');
    leftTasks.innerHTML = uncompletedTasks.length;
    uncompletedTasks.length == 1 ? hideS.classList.add('hideS') : hideS.classList.remove('hideS');
}

const initializeComponent = () => {
    todoList.innerHTML = "";
    countTasks();
    if (tasks.length > 0) {
        tasks.forEach((item, index) => {
            todoList.innerHTML += createDuty(item, index);
        });

        if(!localStorage.tasks){
            infoDuties.classList.add('infoDuties_hide');
        }
        todoItems = document.querySelectorAll('.todo-item');
        isDone = document.querySelectorAll('.isDone');
        deleteDuty = document.querySelectorAll('.deleteDuty');
        spansCompleted = document.querySelectorAll('.spanCompleted');
    }
}

initializeComponent();

const writeToLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const findCompletedTasks = () => {
    for (const item of todoItems) {
        item.classList.contains('checked') ? item.classList.remove('hideS') : item.classList.add('hideS');
    }
}

const findActiveTasks = () => {
    for (const item of todoItems) {
        item.classList.contains('checked') ? item.classList.add('hideS') : item.classList.remove('hideS');
    }
}

const filterTasks  = () => {
    allDuties.classList.contains("focus") ? initializeComponent() : activeDuties.classList.contains("focus") ? findActiveTasks() : completedDuties.classList.contains("focus") ? findCompletedTasks() : "";
}

//Завершение задачи (обработчик события написан в HTML)
const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    todoItems[index].classList.toggle('checked');
    spansCompleted[index].classList.toggle('completed');
    writeToLocal();
    countTasks();
    filterTasks();
}

const functionOnBlur = index => {
    let newValue = todoItems[index].textContent.trim();
    if(newValue != "" && newValue != oldValue){                 
        tasks[index].description = newValue;
    }
    else{
        tasks.splice(index, 1);
        countTasks();
    }
    filterTasks();
    writeToLocal();
    todoItems[index].removeAttribute('contenteditable', true);
    todoItems[index].classList.remove('editable');
    isDone[index].classList.remove('hideS');
    deleteDuty[index].classList.remove('hideS');
}

functionOnKeydown = (event, index) => {
    if (event.key === 'Enter' || event.key === 'Escape') {
        functionOnBlur(index);
    }
}

//Редактирование задачи
const editTask = index => {
    todoItems[index].removeEventListener("blur", () => functionOnBlur(index), true);
    todoItems[index].removeEventListener('keydown', () => functionOnKeydown(event, index));
    //Проверка на завершённость задачи
    if(!todoItems[index].classList.contains('checked')){
        todoItems[index].setAttribute('contenteditable', true);
        todoItems[index].focus();

        oldValue = todoItems[index].textContent;
        todoItems[index].classList.add('editable');
        //Скрываем checkbox и кнопку удаления
        isDone[index].classList.add('hideS');
        deleteDuty[index].classList.add('hideS');

        //Функция выполняется при удалении фокуса с задачи
        todoItems[index].addEventListener("blur", () => functionOnBlur(index), true);

        //Функция выполняется при нажатии на клавиши Enter и Escape
        todoItems[index].addEventListener('keydown', () => functionOnKeydown(event, index));
    }
}

//Удаление задачи (обработчик события написан в HTML)
const deleteTask = index => {
    tasks.splice(index, 1);
    writeToLocal();
    initializeComponent();
    filterTasks();
}

addBtn.addEventListener('click', (index, e) => {
    const completedTasks = tasks.filter(x => x.completed === true);
    if(taskInput.value != ''){
        //Регулярное выражение, определяющее в поле ввода только пробелы
        if(/^[ ]+$/.test(taskInput.value) == false){
            tasks.push(new Task(taskInput.value));
            taskInput.value = "";
            countTasks();
            infoDuties.classList.remove('infoDuties_hide');
        }
    }
    else{
        completedTasks.length < tasks.length ? tasks.forEach(item => item.completed = true) : tasks.forEach(item => item.completed = false);
    }
    writeToLocal();
    initializeComponent();
    filterTasks();
})

//Добавление задачи при выбранной кнопке All
let addAllTasks = () => {
    completedDuties.classList.remove("focus");
    activeDuties.classList.remove("focus");
    allDuties.classList.add("focus");
    initializeComponent();
}
allDuties.addEventListener('click', addAllTasks);

//Добавление задачи при выбранной кнопке Completed
let addCompletedTasks = () =>{
    allDuties.classList.remove("focus");
    activeDuties.classList.remove("focus");
    completedDuties.classList.add("focus");
    findCompletedTasks();
}
completedDuties.addEventListener('click', addCompletedTasks);

//Добавление задачи при выбранной кнопке Active
let addActiveTasks = () => {
    allDuties.classList.remove("focus");
    completedDuties.classList.remove("focus");
    activeDuties.classList.add("focus");
    findActiveTasks();
}
activeDuties.addEventListener('click', addActiveTasks);

//Удаление завершённых задач
const deleteCompletedTasks = () => {
    const completedTasks = tasks.filter(x => x.completed === true);
    completedTasks.forEach(f => tasks.splice(tasks.findIndex(x => x.completed === f.completed),1));
    writeToLocal();
    initializeComponent();
    filterTasks();
}
deleteCompletedDuties.addEventListener('click', deleteCompletedTasks);

//Добавление задачи при нажатии на клавишу Enter
taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        //Проверка на пустоту поля
        if(taskInput.value == '' || taskInput.value.match(/^[ ]+$/)){
        }
        else{
            tasks.push(new Task(taskInput.value));
            taskInput.value = "";
            writeToLocal();
            initializeComponent();
            infoDuties.classList.remove('infoDuties_hide');
            filterTasks();
            countTasks();
        }
    }
})