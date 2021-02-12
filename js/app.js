// array which stores all the tasks
let tasks = [];
// id counter
let idCounter = 0;

//CLASS FOR TASK
class Task {
  constructor(title, details = null, dueDate = null, dueTime = null) {
    this.id = ++idCounter;
    this.title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.isComplete = false;
  }
}

// FUNCTION TO CREATE TASKS
function createTask(event) {
  event.preventDefault();
  const title = event.target['taskTitle'].value;
  const details = event.target['taskDetails'].value;
  const dueDate = new Date(event.target['taskDueDate'].value);
  //if title is not empty
  if (title != '') {
    //create new task instance
    const newTask = new Task(title, details, dueDate);
    // Add new task instance to taskList Array
    tasks.push(newTask);
    // Add to localStorage
    addToLocalStorage(tasks);
    // Clear Input form -- STILL TO ADD
  }
}

// FUNCTION TO ADD TASKS TO LOCALSTORAGE
function addToLocalStorage(tasks) {
  // conver the array to string.
  jsonString = JSON.stringify(tasks);
  // save to localStorage
  localStorage.setItem('tasks', jsonString);
  renderTasks(tasks);
}

// FUNCTION TO READ TASKS TO SCREEN
function renderTasks(tasks) {
  let taskList = document.getElementById('taskList');
  // clear taskList
  taskList.innerHTML = '';

  // Loop through each task in tasks Array
  for (task of tasks) {
    // Destructure the task properties
    const { id, title, isComplete } = task;

    const li = document.createElement('LI');
    const h2 = document.createElement('H2');
    const completeIcon = document.createElement('I');
    const deleteIcon = document.createElement('I');
    const text = document.createTextNode(title);
    if (isComplete) {
      li.className = 'taskList__item taskList__item--checked';
      h2.className = 'taskList__item__name taskList__item__name--checked';
      completeIcon.className =
        'taskList__item__completeIcon taskList__item__completeIcon--checked far fa-check-circle';
    } else {
      li.setAttribute('id', id);
      li.className = 'taskList__item';
      h2.className = 'taskList__item__name';
      completeIcon.className = 'taskList__item__completeIcon far fa-circle';
    }
    deleteIcon.className = 'taskList__item__deleteIcon far fa-trash-alt';
    deleteIcon.setAttribute('onclick', 'deleteTask(event)');
    h2.appendChild(text);
    li.appendChild(completeIcon);
    li.appendChild(h2);
    li.appendChild(deleteIcon);

    taskList.insertBefore(li, taskList.childNodes[0]);
  }
}

// FUNCTION TO GET TASKS FROM LOCALSTORAGE
function getFromLocalStorage() {
  const data = localStorage.getItem('tasks');
  // if reference exists
  if (data) {
    // converts back to array and store it in tasks array
    tasks = JSON.parse(data);
    // SET IDCOUNTER TO LAST USED ID
    console.log(tasks[tasks.length - 1].id);
    renderTasks(tasks);
  }
}
// initially get everything from localStorage
getFromLocalStorage();

// FUNCTION TO DELETE TASKS
function deleteTask(event) {
  const id = event.target.parentElement.id;
  tasks = tasks.filter((x) => {
    return x.id != id;
  });
  // update the localStorage
  addToLocalStorage(tasks);
}

// TOGGLE THE ADD TASK MODAL
function toggleModal() {
  const modal = document.getElementById('addTaskModal');
  modal.classList.toggle('modal--show');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modal = document.getElementById('addTaskModal');
  if (event.target == modal) {
    modal.classList.toggle('modal--show');
  }
};
