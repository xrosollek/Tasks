let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let selectedDate = new Date();
let calendarMonth = new Date();

const taskList = document.getElementById("taskList");
const calendarGrid = document.getElementById("calendarGrid");
const monthLabel = document.getElementById("monthLabel");
const subtitle = document.getElementById("subtitle");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addTask() {
  const input = document.getElementById("taskInput");
  if (!input.value.trim()) return;

  tasks.push({
    id: Date.now(),
    text: input.value,
    date: formatDate(selectedDate),
    done: false
  });

  input.value = "";
  save();
  render();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.done = !task.done;
  save();
  render();
}

function renderTasks() {
  taskList.innerHTML = "";

  subtitle.innerText = selectedDate.toLocaleDateString("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  tasks
    .filter(t => t.date === formatDate(selectedDate))
    .forEach(task => {
      const li = document.createElement("li");
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("div");
      checkbox.className = "checkbox";
      if (task.done) checkbox.classList.add("checked");
      checkbox.onclick = () => toggleTask(task.id);

      li.appendChild(checkbox);
      li.append(task.text);
      taskList.appendChild(li);
    });
}

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  monthLabel.innerText = calendarMonth.toLocaleDateString("pl-PL", {
    month: "long",
    year: "numeric"
  });

  const firstDay = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 1; i < firstDay; i++) {
    calendarGrid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const dateStr = formatDate(date);

    const div = document.createElement("div");
    div.className = "day";
    div.innerText = d;

    if (dateStr === formatDate(new Date())) div.classList.add("today");
    if (dateStr === formatDate(selectedDate)) div.classList.add("selected");
    if (tasks.some(t => t.date === dateStr)) div.classList.add("has-task");

    div.onclick = () => {
      selectedDate = date;
      switchTab("tasks");
      render();
    };

    calendarGrid.appendChild(div);
  }
}

function changeMonth(delta) {
  calendarMonth.setMonth(calendarMonth.getMonth() + delta);
  renderCalendar();
}

function switchTab(tab) {
  document.getElementById("tasksView").classList.toggle("active", tab === "tasks");
  document.getElementById("calendarView").classList.toggle("active", tab === "calendar");

  document.querySelectorAll(".tabbar button").forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabbar button[onclick*="${tab}"]`).classList.add("active");

  document.getElementById("title").innerText =
    tab === "tasks" ? "Zadania" : "Kalendarz";
}

function render() {
  renderTasks();
  renderCalendar();
}

render();
