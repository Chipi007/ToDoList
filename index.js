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

let tasks;

let todoItems = [];

if(!localStorage.tasks){
    tasks = [];
    infoDuties.classList.add('infoDuties_hide');
}
else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    infoDuties.classList.remove('infoDuties_hide');
}

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

    /*tasks.filter(x => x.completed == true).length > 0 ? deleteCompletedDuties.classList.add('visible') : deleteCompletedDuties.classList.remove('visible');

    leftTasks.innerHTML = tasks.filter(x => x.completed == false).length;
    if(tasks.filter(x => x.completed == false).length == 1) {
        hideS.classList.add('hideS');
    }
    else{
        hideS.classList.remove('hideS')
    } */


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
    }
}

initializeComponent();


const writeToLocal = () => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


const completeTask = index => {
    tasks[index].completed = !tasks[index].completed;
    todoItems[index].classList.toggle('completed');
    writeToLocal();
    countTasks();
    if(allDuties.classList.contains("focus")){
        initializeComponent();
    }
    if(activeDuties.classList.contains("focus")){
        todoList.innerHTML = "";
        if (tasks.length > 0){
            if(tasks.filter(x => x.completed == false)){
                tasks.filter(x => x.completed == false).forEach((item, index) => {
                todoList.innerHTML += createDuty(item, index);
                });
            }
        }
    }
    if(completedDuties.classList.contains("focus")){
        todoList.innerHTML = "";
        if (tasks.length > 0){
            tasks.filter(x => x.completed == true).forEach((item, index) => {
            todoList.innerHTML += createDuty(item, index);
            });
        }
    }
}


const editTask = index => {
    if(!todoItems[index].classList.contains('checked')){
        todoItems[index].setAttribute('contenteditable', true);
        todoItems[index].focus();
        let oldValue = todoItems[index].textContent;

        todoItems[index].classList.add('editable');
        isDone[index].classList.add('hideS');
        deleteDuty[index].classList.add('hideS');

        todoItems[index].addEventListener("blur", function( event ) {
            let newValue = todoItems[index].textContent.trim();
            if(newValue != ""){
                if(newValue != oldValue){                    
                    tasks[index].description = newValue;
                    writeToLocal();
                    initializeComponent();
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

        todoItems[index].addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                let newValue = todoItems[index].textContent.trim();
                if(newValue != ""){
                    if(newValue != oldValue){                    
                        tasks[index].description = newValue;
                        writeToLocal();
                        initializeComponent();
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


const deleteTask = index => {
    tasks.splice(index, 1);
    writeToLocal();
    initializeComponent();
}


addBtn.addEventListener('click', (index, e) => {
    if(taskInput.value != ''){
        if(/^[ ]+$/.test(taskInput.value) == false){
            tasks.push(new Task(taskInput.value));
            taskInput.value = "";
            writeToLocal();
            infoDuties.classList.remove('infoDuties_hide');
            if(allDuties.classList.contains("focus")){
                initializeComponent();
            }
            if(activeDuties.classList.contains("focus")){
                todoList.innerHTML = "";
                if (tasks.length > 0){
                    if(tasks.filter(x => x.completed == false)){
                        tasks.filter(x => x.completed == false).forEach((item, index) => {
                        todoList.innerHTML += createDuty(item, index);
                        });
                    }
                }
            }
            if(completedDuties.classList.contains("focus")){
                todoList.innerHTML = "";
                if (tasks.length > 0){
                    if(tasks.filter(x => x.completed == true)){
                        tasks.filter(x => x.completed == true).forEach((item, index) => {
                        todoList.innerHTML += createDuty(item, index);
                        });
                    }
                }
            }
        }
    }
    else{
        if(tasks.filter(x => x.completed == true).length < tasks.length){
            for (let i = 0; i < tasks.length; i++) {
                tasks[i].completed = true;
                writeToLocal();
                initializeComponent(); 
            }
        }
        else{
            for (let i = 0; i < tasks.length; i++) {
                tasks[i].completed = false;
                writeToLocal();
                initializeComponent(); 
            }
        }
    }
})


allDuties.addEventListener('click',
    function addAllTasks(){
        completedDuties.classList.remove("focus");
        activeDuties.classList.remove("focus");
        allDuties.classList.add("focus");
        todoList.innerHTML = "";
        if (tasks.length > 0) {
            tasks.forEach((item, index) => {
                todoList.innerHTML += createDuty(item, index);
            });
        }
    }
)


completedDuties.addEventListener('click',
    function addCompletedTasks(){
        allDuties.classList.remove("focus");
        activeDuties.classList.remove("focus");
        completedDuties.classList.add("focus");
        todoList.innerHTML = "";
        if (tasks.length > 0){
            if(tasks.filter(x => x.completed == true)){
                tasks.filter(x => x.completed == true).forEach((item, index) => {
                todoList.innerHTML += createDuty(item, index);
                });
            }
        }
    }
)


activeDuties.addEventListener('click',
    function addActiveTasks(){
        allDuties.classList.remove("focus");
        completedDuties.classList.remove("focus");
        activeDuties.classList.add("focus");
        todoList.innerHTML = "";
        if (tasks.length > 0){
            if(tasks.filter(x => x.completed == false)){
                tasks.filter(x => x.completed == false).forEach((item, index) => {
                todoList.innerHTML += createDuty(item, index);
                });
            }
        }
    }
)


deleteCompletedDuties.addEventListener('click', 
    function deleteCompletedTasks(){
        completedTasks = tasks.filter(x => x.completed === true);
        completedTasks.forEach(f => tasks.splice(tasks.findIndex(x => x.completed === f.completed),1));
        writeToLocal();
        initializeComponent();
    }
)


taskInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') {
        if(taskInput.value == '' || taskInput.value.match(/^[ ]+$/)){
        }
        else{
            tasks.push(new Task(taskInput.value));
            taskInput.value = "";
            writeToLocal();
            infoDuties.classList.remove('infoDuties_hide');
            if(allDuties.classList.contains("focus")){
                initializeComponent();
            }
            if(activeDuties.classList.contains("focus")){
                todoList.innerHTML = "";
                if (tasks.length > 0){
                    if(tasks.filter(x => x.completed == false)){
                        tasks.filter(x => x.completed == false).forEach((item, index) => {
                        todoList.innerHTML += createDuty(item, index);
                        countTasks();
                        });
                    }
                }
            }
            if(completedDuties.classList.contains("focus")){
                todoList.innerHTML = "";
                if (tasks.length > 0){
                    if(tasks.filter(x => x.completed == false)){
                        tasks.filter(x => x.completed == true).forEach((item, index) => {
                        todoList.innerHTML += createDuty(item, index);
                        });
                        countTasks();
                    }
                }
            }
        }
    }
})