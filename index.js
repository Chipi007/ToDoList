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
    tasks.filter(x => x.completed == true).length > 0 ? deleteCompletedDuties.classList.add('visible') : deleteCompletedDuties.classList.remove('visible');
    leftTasks.innerHTML = tasks.filter(x => x.completed == false).length;
    if(tasks.filter(x => x.completed == false).length == 1) {
        hideS.classList.add('hideS');
    }
    else{
        hideS.classList.remove('hideS')
    } 
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
    for(let i = 0; i < todoItems.length; i++){
        if (todoItems[i].classList.contains('checked')){
            todoItems[i].classList.remove('hideS');
        }
        else{
            todoItems[i].classList.add('hideS');
        }
    }
}

const findActiveTasks = () => {
    for(let i = 0; i < todoItems.length; i++){
        if (todoItems[i].classList.contains('checked')){
            todoItems[i].classList.add('hideS');
        }
        else{
            todoItems[i].classList.remove('hideS');
        }
    }
}

//Завершение задачи (обработчик события написан в HTML)
const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    todoItems[index].classList.toggle('checked');
    spansCompleted[index].classList.toggle('completed');
    writeToLocal();
    countTasks();
    if(allDuties.classList.contains("focus")){
        initializeComponent();
    }
    if(activeDuties.classList.contains("focus")){
        findActiveTasks();
    }
    if(completedDuties.classList.contains("focus")){
        findCompletedTasks();
    }
}

//Редактирование задачи
const editTask = index => {
    //Проверка на завершённость задачи
    if(!todoItems[index].classList.contains('checked')){
        todoItems[index].setAttribute('contenteditable', true);
        todoItems[index].focus();

        let oldValue = todoItems[index].textContent;
        todoItems[index].classList.add('editable');
        //Скрываем checkbox и кнопку удаления
        isDone[index].classList.add('hideS');
        deleteDuty[index].classList.add('hideS');

        //Функция выполняется при удалении фокуса с задачи
        todoItems[index].addEventListener("blur", function( event ) {
            let newValue = todoItems[index].textContent.trim();
            if(newValue != ""){
                if(newValue != oldValue){                    
                    tasks[index].description = newValue;
                    if(activeDuties.classList.contains("focus")){
                        initializeComponent();
                    }
                    if(activeDuties.classList.contains("focus")){
                        findActiveTasks();
                    }
                    if(completedDuties.classList.contains("focus")){
                        findCompletedTasks();
                    }
                    writeToLocal();
                }
            }
            else{
                tasks.splice(index, 1);
                writeToLocal();
                initializeComponent();
                countTasks();
            }
            todoItems[index].removeAttribute('contenteditable', true);
            todoItems[index].classList.remove('editable');
            isDone[index].classList.remove('hideS');
            deleteDuty[index].classList.remove('hideS');
        }, true);

        //Функция выполняется при нажатии на клавиши Enter и Escape
        todoItems[index].addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                let newValue = todoItems[index].textContent.trim();
                if(newValue != ""){
                    if(newValue != oldValue){                    
                        tasks[index].description = newValue;
                        if(activeDuties.classList.contains("focus")){
                            initializeComponent();
                        }
                        if(activeDuties.classList.contains("focus")){
                            findActiveTasks();
                        }
                        if(completedDuties.classList.contains("focus")){
                            findCompletedTasks();
                        }
                        writeToLocal();
                    }
                }
                else{
                    tasks.splice(index, 0);
                    writeToLocal();
                    initializeComponent();
                    countTasks();
                }
                todoItems[index].removeAttribute('contenteditable', true);
                todoItems[index].classList.remove('editable');
                isDone[index].classList.remove('hideS');
                deleteDuty[index].classList.remove('hideS');
            }
        })
    }
}

//Удаление задачи (обработчик события написан в HTML)
const deleteTask = index => {
    tasks.splice(index, 1);
    writeToLocal();
    initializeComponent();
    if(activeDuties.classList.contains("focus")){
        findActiveTasks();
    }
    if(completedDuties.classList.contains("focus")){
       findCompletedTasks();
    }
}

addBtn.addEventListener('click', (index, e) => {
    if(taskInput.value != ''){
        //Регулярное выражение, определяющее в поле ввода только пробелы
        if(/^[ ]+$/.test(taskInput.value) == false){
            tasks.push(new Task(taskInput.value));
            taskInput.value = "";
            writeToLocal();
            initializeComponent();
            countTasks();

            infoDuties.classList.remove('infoDuties_hide');
            if(activeDuties.classList.contains("focus")){
                findActiveTasks();
            }
            if(completedDuties.classList.contains("focus")){
                findCompletedTasks();
            }
        }
    }
    else{
        //Если поле пустое и если хотя бы одна задача не завершена, то по нажатию на кнопку все задачи становятся заврешёнными
        if(tasks.filter(x => x.completed == true).length < tasks.length){
            for (let i = 0; i < tasks.length; i++) {
                tasks[i].completed = true;
                writeToLocal();
                initializeComponent();
                if(activeDuties.classList.contains("focus")){
                    findActiveTasks();
                }
                if(completedDuties.classList.contains("focus")){
                    findCompletedTasks();
                } 
            }
        }
        else{
            //Иначе все задачи становятся не завршёнными
            for (let i = 0; i < tasks.length; i++) {
                tasks[i].completed = false;
                writeToLocal();
                initializeComponent();
                if(activeDuties.classList.contains("focus")){
                    findActiveTasks();
                }
                if(completedDuties.classList.contains("focus")){
                    findCompletedTasks();
                } 
            }
        }
    }
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
    completedTasks = tasks.filter(x => x.completed === true);
    completedTasks.forEach(f => tasks.splice(tasks.findIndex(x => x.completed === f.completed),1));
    writeToLocal();
    initializeComponent();
    if(activeDuties.classList.contains("focus")){
        findActiveTasks();
    }
    if(completedDuties.classList.contains("focus")){
        findCompletedTasks();
    }
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
            if(activeDuties.classList.contains("focus")){
                findActiveTasks();
            }
            if(completedDuties.classList.contains("focus")){
                findCompletedTasks();
            }
            countTasks();
        }
    }
})