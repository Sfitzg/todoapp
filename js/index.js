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
