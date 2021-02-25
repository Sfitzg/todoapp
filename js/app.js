// CLASS FOR TASK
class Task {
  constructor(title, details = null, dueDate = null) {
    this.id = new Date();
    this.title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.createdDate = new Date();
    this.isComplete = false;
  }
}

// CLASS FOR TASKLIST
class TaskList {
  constructor() {
    // array which stores all the tasks
    this.tasks = [];
    // initially get everything from localStorage
    this.loadFromLocalStorage();
  }

  // FUNCTION TO CREATE TASKS
  addTask(event) {
    event.preventDefault();
    const title = event.target['taskTitle'].value;
    const details = event.target['taskDetails'].value;
    const dueTime = event.target['taskDueTime'].value;
    let dueDate = event.target['taskDueDate'].value;

    if (dueDate != '' && dueTime != '') {
      dueDate = new Date(dueDate + ' ' + dueTime);
    } else if (dueDate != '') {
      dueDate = new Date(dueDate);
    } else if (dueTime != '') {
      dueDate = new Date();
      dueDate.setTime(dueTime);
    } else {
      dueDate = null;
    }

    //if title is not empty
    if (title != '') {
      //create new task instance
      const newTask = new Task(title, details, dueDate);
      // Add new task instance to taskList Array
      this.tasks.push(newTask);
      // Add to localStorage
      this.saveToLocalStorage();
      // Clear Input form -- STILL TO ADD
      document.getElementById('taskForm').reset();
      // Close Modal
      toggleModal();
    }
  }

  // FUNCTION TO SAVE TASKS TO LOCALSTORAGE
  saveToLocalStorage() {
    // save to localStorage
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    // Render Tasklist
    this.renderTasksList();
  }

  // FUNCTION TO GET TASKS FROM LOCALSTORAGE
  loadFromLocalStorage() {
    const data = localStorage.getItem('tasks');
    // if there is data
    if (data) {
      // converts back to array and store it in tasks array
      this.tasks = JSON.parse(data, function (key, value) {
        if (key == 'dueDate' && value != null) {
          return new Date(value);
        } else {
          return value;
        }
      });

      this.renderTasksList();
    }
  }

  // FUNCTION TO READ TASKS TO SCREEN
  renderTasksList() {
    let incompleteList = document.getElementById('tasklist-incomplete');
    let completedList = document.getElementById('tasklist-completed');
    let incompleteTasks = 0;
    let completedTasks = 0;
    // clear taskList
    incompleteList.innerHTML = '';
    completedList.innerHTML = '';

    // Loop through each task in tasks Array
    for (const task of this.tasks) {
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
      checkBox.addEventListener('click', () => {
        this.toggleComplete(id);
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
      deleteBtn.addEventListener('click', () => {
        this.deleteTask(id);
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
        console.log(dueDate);
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
        completedTasks += 1;
      } else {
        incompleteList.insertBefore(listItem, incompleteList.childNodes[0]);
        incompleteTasks += 1;
      }
    }

    const accordionCompletedHeading = document.getElementById(
      'accordion-completed-heading'
    );
    accordionCompletedHeading.innerHTML = '';
    const accordioncCompletedText = document.createTextNode(
      `Completed Tasks (${completedTasks})`
    );
    accordionCompletedHeading.appendChild(accordioncCompletedText);
  }

  // FUNCTION TO DELETE TASKS
  deleteTask(id) {
    this.tasks = this.tasks.filter((x) => {
      return x.id != id;
    });
    // update the localStorage
    this.saveToLocalStorage();
  }

  // FUNCTION TOGGLE COMPLETE
  toggleComplete(id) {
    this.tasks = this.tasks.map((item) => {
      if (item.id == id) {
        item.isComplete = !item.isComplete;
      }
      return item;
    });
    // update the localStorage
    this.saveToLocalStorage();
  }

  // FUNCTION TOGGLE COMPLETE
  filterTasks(value) {
    switch (value) {
      case '1':
        this.tasks = this.tasks.sort((a, b) =>
          a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1
        );
        break;
      case '2':
        this.tasks = this.tasks.sort((a, b) =>
          a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        );
        break;
      case '3':
        this.tasks = this.tasks.sort((a, b) =>
          a.createdDate > b.createdDate ? 1 : -1
        );
        break;
      case '4':
        this.tasks = this.tasks.sort((a, b) =>
          a.createdDate < b.createdDate ? 1 : -1
        );
        break;
      default:
        break;
    }
    this.saveToLocalStorage();
  }
}
todo = new TaskList();

function renderTodaysDate() {
  let currentDate = new Date();
  let year = currentDate.getFullYear();

  let dayIndex = currentDate.getDay();
  let dayArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  let day = dayArray[dayIndex];

  let date = currentDate.getDate();

  let monthIndex = currentDate.getMonth();
  let monthArray = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  let month = monthArray[monthIndex];

  currentTime = new Date();
  let hours = currentTime.getHours();
  if (hours < 10) {
    hours = '0' + hours;
  }
  let minutes = currentTime.getMinutes();
  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  todaysDate = `${day}, ${date} ${month} ${year} ${hours}:${minutes}`;

  return todaysDate;
}
document.getElementById('date-today').innerHTML = renderTodaysDate();

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
