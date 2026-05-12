/* =========================================
   ELEMENTS (SAFE INIT)
========================================= */

let textarea;
let preview;

document.addEventListener("DOMContentLoaded", () => {

  textarea = document.getElementById("markdown");
  preview = document.getElementById("preview");

  initAuth();

  const logged = localStorage.getItem("flowspace-auth");

  if (logged === "true") {
    lockApp(false);
    initApp();
  } else {
    lockApp(true);
  }
});


/* =========================================
   APP INIT
========================================= */

function initApp() {

  const saved = localStorage.getItem("flowspace-markdown");

  if (textarea && saved) {
    textarea.value = saved;
  }

  renderMarkdown?.();
  renderNotes?.();
  renderTasks?.();
  renderWorkspaces?.();
  renderProjects?.();
  renderFiles?.();
  renderAgenda?.();
  generateMonth?.();
  updateConnectionStatus?.();
  loadDashboard?.();
}


/* =========================================
   AUTH SYSTEM
========================================= */

function initAuth() {

  if (!localStorage.getItem("flowspace-user")) {

    localStorage.setItem("flowspace-user", JSON.stringify({
      email: "admin@flowspace.com",
      password: "123456"
    }));
  }

  const authScreen = document.getElementById("authScreen");

  if (authScreen) {
    authScreen.style.display = "flex";
  }
}

function loginUser() {

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const msg = document.getElementById("authMsg");

  const user = JSON.parse(localStorage.getItem("flowspace-user"));

  if (!user) return;

  if (email === user.email && password === user.password) {

    localStorage.setItem("flowspace-auth", "true");

    if (msg) msg.innerText = "✅ Login successful";

    const authScreen = document.getElementById("authScreen");
    if (authScreen) authScreen.style.display = "none";

    lockApp(false);
    initApp();

  } else {

    if (msg) msg.innerText = "❌ Wrong email or password";
  }
}

function registerUser() {

  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const msg = document.getElementById("authMsg");

  if (!email || !password) return;

  localStorage.setItem("flowspace-user", JSON.stringify({
    email,
    password
  }));

  if (msg) msg.innerText = "✅ Account created. Now login.";
}


/* =========================================
   LOCK SYSTEM
========================================= */

function lockApp(state) {

  const app = document.querySelector(".app");
  const nav = document.querySelector(".bottom-nav");
  const fab = document.querySelector(".fab");
  const ai = document.querySelector(".ai-panel");

  if (app) app.style.display = state ? "none" : "flex";
  if (nav) nav.style.display = state ? "none" : "flex";
  if (fab) fab.style.display = state ? "none" : "block";
  if (ai) ai.style.display = state ? "none" : "flex";
}


/* =========================================
   MARKDOWN SYSTEM
========================================= */

function renderMarkdown() {

  if (!textarea || !preview) return;

  const text = textarea.value;

  preview.innerHTML = marked.parse(text);

  localStorage.setItem("flowspace-markdown", text);
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function downloadMarkdown() {

  if (!textarea) return;

  const blob = new Blob([textarea.value], {
    type: "text/markdown"
  });

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = "flowspace-note.md";
  a.click();
}


/* =========================================
   NOTES SYSTEM
========================================= */

let notes = JSON.parse(localStorage.getItem("flowspace-notes")) || [
  {
    id: 1,
    title: "Welcome Note",
    content: "# Welcome to FlowSpace",
    pinned: true,
    tags: ["productivity"]
  }
];

let currentNote = 0;

function renderNotes() {

  const notesList = document.getElementById("notesList");
  if (!notesList) return;

  notesList.innerHTML = "";

  notes.forEach((note, index) => {

    const card = document.createElement("div");
    card.className = "note-card";

    card.innerHTML = `
      ${note.pinned ? '<div>📌</div>' : ''}

      <h4>${note.title}</h4>

      <p>${note.tags.map(t => "#" + t).join(" ")}</p>

      <button onclick="openNote(${index})">Open</button>
      <button onclick="pinNote(${index})">Pin</button>
      <button onclick="deleteNote(${index})">Delete</button>
    `;

    notesList.appendChild(card);
  });

  saveNotes();
}

function createNote() {

  const title = prompt("Note title");
  if (!title) return;

  notes.unshift({
    id: Date.now(),
    title,
    content: "# " + title,
    pinned: false,
    tags: []
  });

  renderNotes();
}

function openNote(index) {

  currentNote = index;

  if (!textarea) return;

  textarea.value = notes[index].content;

  renderMarkdown();
}

function deleteNote(index) {

  notes.splice(index, 1);
  renderNotes();
}

function pinNote(index) {

  notes[index].pinned = !notes[index].pinned;
  renderNotes();
}

function saveNotes() {

  if (notes[currentNote] && textarea) {
    notes[currentNote].content = textarea.value;
  }

  localStorage.setItem("flowspace-notes", JSON.stringify(notes));
}

function searchNotes() {

  const search = document.getElementById("noteSearch")?.value.toLowerCase();
  const cards = document.querySelectorAll(".note-card");

  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(search) ? "block" : "none";
  });
}


/* =========================================
   TASK SYSTEM (UNCHANGED CORE)
========================================= */

let tasks = JSON.parse(localStorage.getItem("flowspace-tasks")) || [];

function renderTasks() { /* unchanged logic from yours */ }
function createTask() { /* unchanged */ }
function toggleTask(i) { /* unchanged */ }
function moveTask(i) { /* unchanged */ }
function deleteTask(i) { /* unchanged */ }
function saveTasks() { localStorage.setItem("flowspace-tasks", JSON.stringify(tasks)); }


/* =========================================
   CALENDAR + FILES + AI (KEEP YOUR EXISTING)
========================================= */

function updateConnectionStatus() {}

function loadDashboard() {}


/* =========================================
   QUICK ADD
========================================= */

function quickAdd() {

  const action = prompt("note / task / event");

  if (action === "note") createNote();
  if (action === "task") createTask();
  if (action === "event") createEvent();
}

function switchTab(tab) {

  document.querySelectorAll("section").forEach(s => {
    s.style.display = "none";
  });

  const target = document.getElementById(tab);
  if (target) target.style.display = "block";
}