const SUBJECTS = [
  { name: "Matemática", icon: "📐" },
  { name: "Português", icon: "📘" },
  { name: "Programação", icon: "💻" },
  { name: "História", icon: "🏛️" },
  { name: "Outras", icon: "📚" }
];
const STORAGE_KEY = "studyplan-tasks-v1";
let tasks = loadTasks();
let calendarDate = new Date();
let selectedCalendarDate = dateKey(new Date());

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) return JSON.parse(saved);
  } catch (error) { console.warn("Não foi possível carregar as tarefas:", error); }
  return [];
}
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function parseDate(value) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDate(value) {
  const date = parseDate(value);
  return date ? date.toLocaleDateString("pt-BR") : "Sem prazo definido";
}
function subjectIcon(name) {
  return SUBJECTS.find(subject => subject.name === name)?.icon || "📚";
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
function getStats() {
  const completed = tasks.filter(task => task.completed).length;
  const total = tasks.length;
  return { total, completed, pending: total - completed, percent: total ? Math.round(completed / total * 100) : 0 };
}
function filteredTasks(filter) {
  if (filter === "pending") return tasks.filter(task => !task.completed);
  if (filter === "completed") return tasks.filter(task => task.completed);
  return tasks;
}
function sortTasks(list) {
  return [...list].sort((a, b) => {
    if (!a.dueDate && !b.dueDate) return b.createdAt - a.createdAt;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  });
}
function renderTaskList(containerId, emptyId, filter = "all") {
  const container = document.getElementById(containerId);
  const empty = document.getElementById(emptyId);
  const list = sortTasks(filteredTasks(filter));
  container.innerHTML = list.map(task => {
    const overdue = task.dueDate && task.dueDate < dateKey(new Date()) && !task.completed;
    return `<article class="task-item ${task.completed ? "done" : ""}">
      <input class="task-check" type="checkbox" aria-label="Marcar ${escapeHTML(task.title)} como concluída" data-action="toggle" data-id="${task.id}" ${task.completed ? "checked" : ""}>
      <div class="task-info">
        <strong>${escapeHTML(task.title)}</strong>
        ${task.description ? `<p class="task-description">${escapeHTML(task.description)}</p>` : ""}
        <small>${subjectIcon(task.subject)} ${escapeHTML(task.subject)} · Prazo: ${formatDate(task.dueDate)}</small>
      </div>
      ${task.dueDate ? `<span class="task-due ${overdue ? "overdue" : ""}">${overdue ? "Atrasada" : formatDate(task.dueDate)}</span>` : ""}
      <button class="delete-btn" title="Excluir tarefa" aria-label="Excluir ${escapeHTML(task.title)}" data-action="delete" data-id="${task.id}">✕</button>
    </article>`;
  }).join("");
  empty.hidden = list.length > 0;
}
function renderSubjects() {
  const html = SUBJECTS.map(subject => {
    const related = tasks.filter(task => task.subject === subject.name);
    const completed = related.filter(task => task.completed).length;
    const percent = related.length ? Math.round(completed / related.length * 100) : 0;
    return `<div class="subject-row"><span class="subject-symbol">${subject.icon}</span><div class="subject-details"><b>${subject.name}</b><small>${related.length ? `${completed} de ${related.length} tarefa(s) concluída(s)` : "Nenhuma tarefa"}</small></div></div>`;
  }).join("");
  document.getElementById("subjectSummary").innerHTML = html;
  document.getElementById("subjectCards").innerHTML = SUBJECTS.map(subject => {
    const related = tasks.filter(task => task.subject === subject.name);
    const completed = related.filter(task => task.completed).length;
    const percent = related.length ? Math.round(completed / related.length * 100) : 0;
    return `<article class="subject-card"><div class="subject-card-top"><span class="subject-symbol">${subject.icon}</span><div><h3>${subject.name}</h3><p>${related.length ? `${completed} de ${related.length} tarefa(s) concluída(s)` : "Nenhuma tarefa cadastrada"}</p></div></div><div class="progress-label"><span>Progresso</span><b>${percent}%</b></div><div class="mini-progress"><span style="width:${percent}%"></span></div></article>`;
  }).join("");
  document.getElementById("subjectProgress").innerHTML = SUBJECTS.map(subject => {
    const related = tasks.filter(task => task.subject === subject.name);
    const completed = related.filter(task => task.completed).length;
    const percent = related.length ? Math.round(completed / related.length * 100) : 0;
    return `<div class="subject-progress-row"><div class="progress-label"><span>${subject.icon} ${subject.name} (${completed}/${related.length})</span><b>${percent}%</b></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div></div>`;
  }).join("");
}
function renderStats() {
  const s = getStats();
  document.getElementById("totalTasks").textContent = s.total;
  document.getElementById("completedTasks").textContent = s.completed;
  document.getElementById("pendingTasks").textContent = s.pending;
  document.getElementById("progressNumber").textContent = `${s.percent}%`;
  document.getElementById("progressLabel").textContent = `${s.percent}%`;
  document.getElementById("progressBar").style.width = `${s.percent}%`;
  document.getElementById("progressTotal").textContent = s.total;
  document.getElementById("progressCompleted").textContent = s.completed;
  document.getElementById("progressPending").textContent = s.pending;
  document.getElementById("bigProgressNumber").textContent = `${s.percent}%`;
  document.getElementById("bigProgressBar").style.width = `${s.percent}%`;
  document.getElementById("bigProgressText").textContent = s.total ? `${s.completed} de ${s.total} tarefas concluídas. ${s.pending ? "Continue avançando, falta pouco!" : "Parabéns! Todas as tarefas foram concluídas."}` : "Você ainda não cadastrou tarefas.";
  document.getElementById("encouragement").textContent = s.total === 0 ? "🎯 Comece cadastrando uma tarefa. Você consegue!" : s.percent === 100 ? "🏆 Excelente! Você concluiu todas as suas tarefas." : "🎯 Mais da metade concluída? Continue assim!";
}
function renderAll() {
  renderStats();
  renderTaskList("taskList", "emptyTasks", document.getElementById("taskFilter").value);
  renderTaskList("taskList2", "emptyTasks2", document.getElementById("taskFilter2").value);
  renderSubjects();
  renderCalendar();
}
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function navigate(page) {
  document.querySelectorAll(".page").forEach(section => section.classList.toggle("active", section.id === `page-${page}`));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === page));
  document.getElementById("sidebar").classList.remove("open");
  window.location.hash = page;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  document.getElementById("calendarTitle").textContent = calendarDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();
  const todayKey = dateKey(new Date());
  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  let html = dayNames.map(day => `<div class="calendar-day-name">${day}</div>`).join("");
  for (let i = 0; i < 42; i++) {
    let date, muted = false;
    if (i < startOffset) { date = new Date(year, month - 1, prevMonthDays - startOffset + i + 1); muted = true; }
    else if (i >= startOffset + daysInMonth) { date = new Date(year, month + 1, i - startOffset - daysInMonth + 1); muted = true; }
    else date = new Date(year, month, i - startOffset + 1);
    const key = dateKey(date);
    const hasTask = tasks.some(task => task.dueDate === key);
    html += `<button class="calendar-day ${muted ? "muted" : ""} ${key === todayKey ? "today" : ""} ${key === selectedCalendarDate ? "selected" : ""}" data-calendar-date="${key}">${date.getDate()}${hasTask ? '<span class="day-dot"></span>' : ""}</button>`;
  }
  document.getElementById("calendarGrid").innerHTML = html;
  const dueTasks = sortTasks(tasks.filter(task => task.dueDate === selectedCalendarDate));
  document.getElementById("calendarTasks").innerHTML = dueTasks.length ? dueTasks.map(task => `<div class="calendar-task">${task.completed ? "✅" : "📌"} ${escapeHTML(task.title)}<small>${escapeHTML(task.subject)} · ${task.completed ? "Concluída" : "Pendente"}</small></div>`).join("") : `<p class="subtitle">Nenhuma atividade com prazo em ${formatDate(selectedCalendarDate)}.</p>`;
}
document.getElementById("taskForm").addEventListener("submit", event => {
  event.preventDefault();
  const title = document.getElementById("taskName").value.trim();
  const description = document.getElementById("taskDescription").value.trim();
  const subject = document.getElementById("taskSubject").value;
  const dueDate = document.getElementById("taskDate").value;
  if (!title || !subject) return;
  tasks.push({ id: (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`), title, description, subject, dueDate, completed: false, createdAt: Date.now() });
  saveTasks();
  event.target.reset();
  renderAll();
  showToast("Tarefa cadastrada com sucesso!");
});
document.addEventListener("click", event => {
  const nav = event.target.closest("[data-page]");
  if (nav) navigate(nav.dataset.page);
  const go = event.target.closest("[data-go]");
  if (go) navigate(go.dataset.go);
  const action = event.target.closest("[data-action]");
  if (action) {
    const id = action.dataset.id;
    if (action.dataset.action === "delete") {
      tasks = tasks.filter(task => task.id !== id);
      saveTasks(); renderAll(); showToast("Tarefa excluída.");
    } else if (action.dataset.action === "toggle") {
      const task = tasks.find(item => item.id === id);
      if (task) task.completed = action.checked;
      saveTasks(); renderAll(); showToast(task?.completed ? "Tarefa concluída!" : "Tarefa reaberta.");
    }
  }
  const calendarDay = event.target.closest("[data-calendar-date]");
  if (calendarDay) { selectedCalendarDate = calendarDay.dataset.calendarDate; renderCalendar(); }
});
document.getElementById("taskFilter").addEventListener("change", event => renderTaskList("taskList", "emptyTasks", event.target.value));
document.getElementById("taskFilter2").addEventListener("change", event => renderTaskList("taskList2", "emptyTasks2", event.target.value));
document.getElementById("bannerNewTask").addEventListener("click", () => {
  navigate("inicio");
  document.getElementById("taskFormPanel").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("taskName").focus({ preventScroll: true });
});
document.getElementById("focusNewTask").addEventListener("click", () => {
  navigate("inicio");
  document.getElementById("taskName").focus({ preventScroll: true });
  document.getElementById("taskFormPanel").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("goCreateTask").addEventListener("click", () => {
  navigate("inicio");
  document.getElementById("taskFormPanel").scrollIntoView({ behavior: "smooth", block: "center" });
});
document.getElementById("prevMonth").addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); });
document.getElementById("nextMonth").addEventListener("click", () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); });
document.getElementById("menuToggle").addEventListener("click", () => document.getElementById("sidebar").classList.toggle("open"));
window.addEventListener("hashchange", () => {
  const page = location.hash.slice(1);
  if (["inicio", "tarefas", "disciplinas", "calendario", "progresso"].includes(page)) navigate(page);
});
document.getElementById("year").textContent = new Date().getFullYear();
if (["inicio", "tarefas", "disciplinas", "calendario", "progresso"].includes(location.hash.slice(1))) {
  document.querySelectorAll(".page").forEach(section => section.classList.toggle("active", section.id === `page-${location.hash.slice(1)}`));
  document.querySelectorAll(".nav-link").forEach(link => link.classList.toggle("active", link.dataset.page === location.hash.slice(1)));
}
renderAll();
if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(error => console.warn("Service Worker não registrado:", error)));
}
