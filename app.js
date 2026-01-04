let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let modalTaskId = null;
let modalDate = null;

const tasksView = document.getElementById("tasksView");
const calendarView = document.getElementById("calendarView");

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function format(d) {
  return d.toISOString().split("T")[0];
}

/* -------- TASKS VIEW -------- */

function renderTasks() {
  tasksView.innerHTML = "";

  const grouped = {};
  tasks.forEach(t => {
    if (!grouped[t.date]) grouped[t.date] = [];
    grouped[t.date].push(t);
  });

  Object.keys(grouped).sort().forEach(date => {
    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = `<h2>${new Date(date).toLocaleDateString("pl-PL")}</h2>`;

    grouped[date].forEach(task => {
      const el = document.createElement("div");
      el.className = "task" + (task.done ? " done" : "");
      el.innerHTML = `
        <div class="checkbox"></div>
        <div>${task.text}</div>
      `;
      el.onclick = () => openModal(task);
      section.appendChild(el);
    });

    tasksView.appendChild(section);
  });
}

/* -------- CALENDAR VIEW -------- */

function renderCalendar() {
  calendarView.innerHTML = `<div class="calendar"></div>`;
  const grid = calendarView.querySelector(".calendar");

  for (let i = 1; i <= 30; i++) {
    const d = format(new Date(2024, 8, i));
    const day = document.createElement("div");
    day.className = "day";
    day.innerText = i;
    if (tasks.some(t => t.date === d)) day.classList.add("has-task");
    day.onclick = () => openModal(null, d);
    grid.appendChild(day);
  }
}

/* -------- MODAL -------- */

function openModal(task = null, date = null) {
  modalTaskId = task?.id || null;
  modalDate = task?.date || date || format(new Date());
  document.getElementById("modalInput").value = task?.text || "";
  document.getElementById("modalDate").value = modalDate;
  document.getElementById("taskModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("taskModal").classList.add("hidden");
}

function saveModal() {
  const text = modalInput.value;
  const date = modalDateInput.value;

  if (modalTaskId) {
    const t = tasks.find(t => t.id === modalTaskId);
    t.text = text;
    t.date = date;
  } else {
    tasks.push({ id: Date.now(), text, date, done: false });
  }

  save();
  closeModal();
  render();
}

/* -------- NAV -------- */

function switchTab(tab) {
  tasksView.classList.toggle("active", tab === "tasks");
  calendarView.classList.toggle("active", tab === "calendar");
  document.querySelectorAll(".tabbar button")
    .forEach(b => b.classList.remove("active"));
  document.querySelector(`.tabbar button[onclick*=${tab}]`)
    .classList.add("active");
}

function render() {
  renderTasks();
  renderCalendar();
}

render();
