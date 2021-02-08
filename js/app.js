let taskList = [
  {
    id: 1,
    name: 'Get Milk & Coffee',
    description: '',
    dueDate: '',
    dueTime: '',
    isComplete: true,
  },
  {
    id: 2,
    name: 'feed the Dogs',
    description: '',
    dueDate: '',
    dueTime: '',
    isComplete: false,
  },
  {
    id: 3,
    name: 'Doctors App',
    description: '',
    dueDate: '',
    dueTime: '',
    isComplete: true,
  },
];

function renderTasks(taskList) {
  for (const task in taskList) {
    const { name, isComplete } = taskList[task];
    const li = document.createElement('LI');
    const h2 = document.createElement('H2');
    const completeIcon = document.createElement('I');
    const deleteIcon = document.createElement('I');
    const text = document.createTextNode(name);
    if (isComplete) {
      li.className = 'taskList__item taskList__item--checked';
      h2.className = 'taskList__item__name taskList__item__name--checked';
      completeIcon.className =
        'taskList__item__completeIcon taskList__item__completeIcon--checked far fa-check-circle';
    } else {
      li.className = 'taskList__item';
      h2.className = 'taskList__item__name';
      completeIcon.className = 'taskList__item__completeIcon far fa-circle';
    }
    deleteIcon.className = 'taskList__item__deleteIcon far fa-trash-alt';
    h2.appendChild(text);
    li.appendChild(completeIcon);
    li.appendChild(h2);
    li.appendChild(deleteIcon);
    document.getElementById('taskList').appendChild(li);
  }
}

renderTasks(taskList);

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
