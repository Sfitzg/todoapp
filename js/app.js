// array which stores all the tasks
let tasks = [];
// id counter
let idCounter = 0;

//CLASS FOR TASK
class Task {
  constructor(title, details = null, dueDate = null, dueTime = null) {
    this.id = idCounter++;
    this.title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.createdDate = new Date();
    this.isComplete = false;
  }
}

// FUNCTION TO CREATE TASKS
function createTask(event) {
  event.preventDefault();
  const title = event.target['taskTitle'].value;
  const details = event.target['taskDetails'].value;
  let dueDate = event.target['taskDueDate'].value;

  if (dueDate != '') {
    dueDate = new Date(dueDate);
  } else {
    dueDate = null;
  }

  //if title is not empty
  if (title != '') {
    //create new task instance
    const newTask = new Task(title, details, dueDate);
    // Add new task instance to taskList Array
    tasks.push(newTask);
    // Add to localStorage
    addToLocalStorage(tasks);
    // Clear Input form -- STILL TO ADD
    document.getElementById('taskForm').reset();
    // Close Modal
    toggleModal();
  }
}

// FUNCTION TO ADD TASKS TO LOCALSTORAGE
function addToLocalStorage(tasks) {
  // conver the array to string.
  jsonIdCounterString = JSON.stringify(idCounter);
  jsonTasksString = JSON.stringify(tasks);
  // save to localStorage
  localStorage.setItem('tasks', jsonTasksString);
  localStorage.setItem('idCounter', jsonIdCounterString);

  renderTasks(tasks);
}

// FUNCTION TO READ TASKS TO SCREEN
function renderTasks(tasks) {
  let uncompleteList = document.getElementById('tasklist-uncomplete');
  let completedList = document.getElementById('tasklist-complete');
  // clear taskList
  uncompleteList.innerHTML = '';
  completedList.innerHTML = '';

  // Loop through each task in tasks Array
  for (task of tasks) {
    // Destructure the task properties
    const { id, title, isComplete, dueDate } = task;

    // Create Elements
    const checkBox = document.createElement('input');
    const checkBoxLabel = document.createElement('label');
    const titleNode = document.createTextNode(title);
    const editBtn = document.createElement('i');
    const deleteBtn = document.createElement('i');
    const dueDateNode = document.createTextNode(dueDate);
    const topDiv = document.createElement('div');
    const bottomDiv = document.createElement('div');
    const listItem = document.createElement('li');

    // CHECKBOX
    checkBox.setAttribute('type', 'checkbox');
    checkBox.classList.add('form-check-input');
    checkBox.setAttribute('id', 'task' + id);
    if (isComplete) {
      checkBox.setAttribute('checked', 'checked');
    }
    checkBox.addEventListener('click', function () {
      toggleComplete(id);
    });

    // CHECKBOX LABEL
    checkBoxLabel.setAttribute('for', 'task' + id);
    checkBoxLabel.appendChild(titleNode);
    checkBoxLabel.classList.add('form-check-label');
    if (isComplete) {
      checkBoxLabel.classList.add('form-check-label-checked');
    }

    // EDIT BUTTON
    editBtn.classList.add('far', 'fa-edit');
    editBtn.classList.add('tasklist-item-editbtn');

    // DELETE BUTTON
    deleteBtn.classList.add('far', 'fa-trash-alt');
    deleteBtn.classList.add('tasklist-item-deletebtn');
    deleteBtn.addEventListener('click', function () {
      deleteTask(id);
    });
    // DUE DATE

    // TOP DIV SECTION
    topDiv.classList.add('tasklist-item-top');
    topDiv.appendChild(checkBox);
    topDiv.appendChild(checkBoxLabel);
    topDiv.appendChild(editBtn);
    topDiv.appendChild(deleteBtn);

    // BOTTOM DIV SECTION
    bottomDiv.classList.add('tasklist-item-bottom');
    if (dueDate) {
      bottomDiv.appendChild(dueDateNode);
    }

    // LIST ITEM
    listItem.className = 'tasklist-item';
    listItem.setAttribute('data-id', id);
    if (isComplete) {
      listItem.classList.add('tasklist-item-checked');
    }
    listItem.appendChild(topDiv);
    listItem.appendChild(bottomDiv);

    // ADD LIST ITEMS TO COMPLETED OR UNCOMPLETE LIST
    if (isComplete) {
      completedList.insertBefore(listItem, completedList.childNodes[0]);
    } else {
      uncompleteList.insertBefore(listItem, uncompleteList.childNodes[0]);
    }
  }
}

// FUNCTION TO GET TASKS FROM LOCALSTORAGE
function getFromLocalStorage() {
  const data = localStorage.getItem('tasks');
  const idData = localStorage.getItem('idCounter');
  // if there is data
  if (data) {
    // converts back to array and store it in tasks array
    // Set idCounter to last used ID
    idCounter = JSON.parse(idData);
    tasks = JSON.parse(data, function (key, value) {
      if (key == 'dueDate' && value != null) {
        return new Date(value);
      } else {
        return value;
      }
    });

    renderTasks(tasks);
  }
}
// initially get everything from localStorage
getFromLocalStorage();

// FUNCTION TO DELETE TASKS
function deleteTask(id) {
  tasks = tasks.filter((x) => {
    return x.id != id;
  });
  // update the localStorage
  addToLocalStorage(tasks);
}

// FUNCTION TOGGLE COMPLETE
function toggleComplete(id) {
  tasks = tasks.map((item) => {
    if (item.id == id) {
      item.isComplete = !item.isComplete;
    }
    return item;
  });
  // update the localStorage
  addToLocalStorage(tasks);
}

// FUNCTION TOGGLE COMPLETE
function filterTasks() {
  console.log('filter');
}

// ACCORDION TOGGLE
function toggleAccordion(button) {
  // TOGGLE BUTTON ACCORDION CLOSED CLASS
  button.classList.toggle('accordion-closed');
  // TOGGLE ACCORDION PANEL HIDDEN
  const panel = button.nextElementSibling;
  panel.classList.toggle('accordion-panel-hidden');
}
const acc = document.getElementsByClassName('accordion');
for (button of acc) {
  button.addEventListener('click', function () {
    toggleAccordion(this);
  });
}

// TOGGLE THE ADD TASK MODAL
function toggleModal(type) {
  const modal = document.getElementById('addTaskModal');
  modal.classList.toggle('modal-show');
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modal = document.getElementById('addTaskModal');
  if (event.target == modal) {
    modal.classList.toggle('modal-show');
  }
};
