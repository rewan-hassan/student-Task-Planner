const taskForm = document.getElementById("task-form"); 
const taskInput = document.getElementById("task-input"); 
const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");
const progressText = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar"); 
const emptyMessage = document.getElementById("empty-message");

const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("studentTasks")) || []; 
let currentFilter = "all";

// Save tasks in the browser 
function saveTasks() {
   localStorage.setItem("studentTasks", JSON.stringify(tasks)); 
  }

// Add a new task 
taskForm.addEventListener("submit", function (event) { 
  event.preventDefault();

const taskText = taskInput.value.trim();

if (taskText === "") { 
  return; 
}

const newTask = { 
  id: Date.now(),
  text: taskText,
  completed: false 
};

tasks.push(newTask);
saveTasks();
renderTasks();

taskInput.value = "";
taskInput.focus();
});

// Display tasks
function renderTasks() { 
  taskList.innerHTML = "";


const filteredTasks = tasks.filter(function (task) {
  if (currentFilter === "active") { 
    return !task.completed; }
  if (currentFilter === "completed") {
    return task.completed;
  }

  return true;
});
filteredTasks.forEach(function (task) {
  const li = document.createElement("li"); 
  li.className = "task-item";

  if (task.completed) {
    li.classList.add("completed");
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", "Mark task as completed");

  checkbox.addEventListener("change", function () {
    toggleTask(task.id);
  });

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";

  deleteButton.addEventListener("click", function () {
    deleteTask(task.id);
  });

  li.append(checkbox, span, deleteButton);
  taskList.appendChild(li);
});
emptyMessage.hidden = filteredTasks.length > 0;
if (filteredTasks.length === 0) {
  if (tasks.length === 0) {
    emptyMessage.textContent = "No tasks yet. Add your first task!"; 
    } else { 
      emptyMessage.textContent = "No tasks found in this filter.";
  }
    }
updateProgress(); 
}

// Mark task completed or active
function toggleTask(id) { 
  tasks = tasks.map(function (task) {
  if (task.id === id) {
    return {
        ...task,
        completed: !task.completed
      }; 
      }

return task;
});

saveTasks();
renderTasks();
}
// Delete a task 
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
 return task.id !== id; 
    });

saveTasks(); 
renderTasks();
 }
// Update progress information 
function updateProgress() {
  const total = tasks.length;

const completed = tasks.filter(function (task) {
  return task.completed;
}).length;
const percentage = total === 0 
? 0
 :Math.round((completed / total) * 100);

progressText.textContent = percentage + "% completed";
 progressBar.style.width = percentage + "%";
taskCount.textContent = completed + " completed out of " + total + " tasks";
 }
// Filter tasks
 filterButtons.forEach(function (button) {
   button.addEventListener("click", function () { 
    currentFilter = button.dataset.filter;
filterButtons.forEach(function (filterButton) {
  filterButton.classList.remove("active");
});

button.classList.add("active");

renderTasks();
}); });
// Load saved tasks when the page opens renderTasks();