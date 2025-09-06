const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const filters = document.querySelectorAll(".filters button");
const toggleThemeBtn = document.getElementById("toggle-theme");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "pending") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  if (filteredTasks.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Nenhuma tarefa encontrada.";
    li.style.opacity = "0.7";
    taskList.appendChild(li);
  } else {
    filteredTasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";

      const span = document.createElement("span");
      span.textContent = task.text;
      span.addEventListener("click", () => toggleTask(index));

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.addEventListener("click", () => removeTask(index));

      li.appendChild(span);
      li.appendChild(removeBtn);
      taskList.appendChild(li);
    });
  }

  updateCounter();
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({ text, done: false });
  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].done = !tasks[index].done;
  renderTasks();
}

function removeTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function updateCounter() {
  const pending = tasks.filter(t => !t.done).length;
  const done = tasks.filter(t => t.done).length;
  taskCounter.textContent = `${pending} pendentes • ${done} concluídas`;
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

filters.forEach(btn => {
  btn.addEventListener("click", () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

toggleThemeBtn.addEventListener("click", () => {
  const theme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", theme);
  toggleThemeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
});

// Inicialização
document.body.setAttribute("data-theme", localStorage.getItem("theme") || "light");
toggleThemeBtn.textContent = document.body.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
renderTasks();
