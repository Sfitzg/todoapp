// CLASS FOR STORAGE
class Storage {
  // SAVE TO LOCALSTORAGE
  static save(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // FUNCTION TO GET TASKS FROM LOCALSTORAGE
  static get(key) {
    const data = localStorage.getItem(key);
    return data === null
      ? null
      : JSON.parse(data, function (key, value) {
          if (key == 'dueDate' || (key == 'createdDate' && value != null)) {
            return new Date(value);
          } else {
            return value;
          }
        });
  }

  static unset(key) {
    if (this.isset(key)) return localStorage.removeItem(key);
    else return null;
  }

  static clear() {
    return localStorage.clear();
  }

  static isset(key) {
    return this.get(key) !== null;
  }
}

// CLASS FOR TASK
class Task {
  constructor(
    id = new Date(),
    title,
    details = null,
    dueDate = null,
    createdDate = new Date(),
    isComplete = false
  ) {
    this.id = id;
    this._title = title;
    this.details = details;
    this.dueDate = dueDate;
    this.createdDate = createdDate;
    this.isComplete = isComplete;
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
  }

  // FUNCTION TOGGLE COMPLETE
  toggleComplete() {
    this.isComplete = !this.isComplete;
  }
}

// CLASS FOR TASKLIST
class TaskList {
  constructor() {
    this.tasks = [];
    // initially get tasks from localStorage and convert back to objects
    this.convertTasksToObject();
    // Render the TaskList
    this.renderTasksList();
  }

  convertTasksToObject() {
    const retrievedtasks = Storage.get('tasks') || [];
    for (let task of retrievedtasks) {
      task = new Task(
        task.id,
        task._title,
        task.details,
        task.dueDate,
        task.createdDate,
        task.isComplete
      );
      this.tasks.push(task);
    }
  }

  // FUNCTION TO CREATE TASKS
  addTask(task) {
    // Add task to the array
    this.tasks.push(task);
    // Save to localStorage
    Storage.save('tasks', this.tasks);
    // Re render Tasklist
    this.renderTasksList();
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
      const checkBoxDiv = document.createElement('div');
      const titleEl = document.createElement('div');
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
        task.toggleComplete();
        // Save to localStorage
        Storage.save('tasks', this.tasks);
        // Re render Tasklist
        this.renderTasksList();
      });
      checkBoxLabel.setAttribute('for', 'task' + id);
      checkBoxLabel.classList.add('form-check-label');
      checkBoxDiv.appendChild(checkBox);
      checkBoxDiv.appendChild(checkBoxLabel);

      // TITLE
      titleEl.appendChild(titleNode);
      titleEl.classList.add('tasklist-item-title');
      if (isComplete) {
        titleEl.classList.add('tasklist-item-title-checked');
      }
      titleEl.addEventListener('click', () => {
        const titleInput = document.createElement('input');
        titleInput.setAttribute('value', title);
        titleEl.replaceWith(titleInput);
        titleInput.focus();
        titleInput.addEventListener('blur', () => {
          const titleInputValue = titleInput.value;
          task.title = titleInputValue;
          // Save to localStorage
          Storage.save('tasks', this.tasks);
          // Re render Tasklist
          this.renderTasksList();
        });
      });

      // EDIT BUTTON
      editBtn.classList.add('far', 'fa-edit');
      editBtn.classList.add('tasklist-item-editbtn');
      editBtn.addEventListener('click', () => {
        console.log('Edit Modal');
      });

      // DELETE BUTTON
      deleteBtn.classList.add('far', 'fa-trash-alt');
      deleteBtn.classList.add('tasklist-item-deletebtn');
      deleteBtn.addEventListener('click', () => {
        this.deleteTask(id);
      });
      // DUE DATE

      // TOP DIV SECTION
      topDiv.classList.add('tasklist-item-top');
      topDiv.appendChild(checkBoxDiv);
      topDiv.appendChild(titleEl);
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
    console.log(this.tasks);
  }

  // FUNCTION TO DELETE TASKS
  deleteTask(id) {
    this.tasks = this.tasks.filter((x) => {
      return x.id != id;
    });
    // Save to localStorage
    Storage.save('tasks', this.tasks);
    // Re render Tasklist
    this.renderTasksList();
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
    // Save to localStorage
    Storage.save('tasks', this.tasks);
    // Re render Tasklist
    this.renderTasksList();
  }
}
todo = new TaskList();

class FormValidator {
  static REQUIRED = 'REQUIRED';

  static validate(value, flag, validatorValue) {
    if (flag === this.REQUIRED) {
      return value.trim().length > 0;
    }
  }
}

class TaskInputForm {
  constructor() {
    this.form = document.getElementById('task-input-form');
    this.titleInput = document.getElementById('taskTitle');
    this.detailsInput = document.getElementById('taskDetails');
    this.dueDateInput = document.getElementById('taskDueDate');
    this.dueTimeInput = document.getElementById('taskDueTime');

    this.form.addEventListener('submit', this.createTaskHandler.bind(this));
  }

  createTaskHandler(event) {
    event.preventDefault();
    const enteredTitle = this.titleInput.value;
    const enteredDetails = this.detailsInput.value || null;
    const enteredDueDate = this.dueDateInput.value || null;
    const enteredDueTime = this.dueTimeInput.value || null;
    let taskDue = null;

    // Check if there is a due Date
    if (enteredDueDate != null && enteredDueTime == null) {
      taskDue = new Date(enteredDueDate);
      taskDue.setMinutes(taskDue.getMinutes() + taskDue.getTimezoneOffset());
    } else if (enteredDueDate != null && enteredDueTime != null) {
      taskDue = new Date(enteredDueDate + 'T' + enteredDueTime);
    } else if (enteredDueDate == null && enteredDueTime != null) {
      taskDue = new Date();
      // taskDue.setTime('T' + enteredDueTime);
      console.log(taskDue);
      // const showDate = taskDue.getDate();
      // console.log(showDate);
    }

    if (!FormValidator.validate(enteredTitle, FormValidator.REQUIRED)) {
      console.log('Invalid - Title is required');
      return;
    }
    // Create newTask
    const newTask = new Task(
      (title = enteredTitle),
      (details = enteredDetails),
      (dueDate = taskDue)
    );
    // Add newTask to TaskList
    todo.addTask(newTask);
    // // Clear Input form
    this.form.reset();
    // // Close Modal
    addTaskModal.toggle();
  }
}
new TaskInputForm();

class Modal {
  constructor(toggle, modalElement) {
    this.modal = document.querySelector(modalElement);
    this.modalToggle = document.querySelector(toggle);

    this.modalToggle.addEventListener('click', this.toggle.bind(this));
    // window.onclick = this.toggle.bind(this);
  }

  toggle() {
    this.modal.classList.toggle('modal-show');
  }

  close() {
    this.modal.classList.remove('modal-show');
  }

  // When the user clicks anywhere outside of the modal, close it
  // window.onclick = function (event) {
  //   const modal = document.getElementById('addTaskModal');
  //   if (event.target == modal) {
  //     modal.classList.toggle('modal-show');
  //   }
  // }
}
const addTaskModal = new Modal('.add-task-button', '#add-task-modal');

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
