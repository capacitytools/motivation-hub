/* ================= QUOTES ================= */

const quotes = [
  {
    category: "Discipline",
    text: "Discipline is choosing what you want most over what you want now.",
    author: "Unknown",
    actionStep: "Choose one important task and start it in the next five minutes."
  },
  {
    category: "Success",
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
    actionStep: "Write down three small tasks you must complete today."
  },
  {
    category: "Action",
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
    actionStep: "Take one real step toward your goal before the end of today."
  },
  {
    category: "Focus",
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    actionStep: "Set a 25-minute timer and focus on one task without distraction."
  },
  {
    category: "Habits",
    text: "First we make our habits, then our habits make us.",
    author: "John Dryden",
    actionStep: "Choose one positive habit to complete today."
  },
  {
    category: "Faith",
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    author: "Jeremiah 29:11",
    actionStep: "Write down one hope or goal you are trusting God for."
  },
  {
    category: "Productivity",
    text: "The secret of getting ahead is getting started.",
    author: "Mark Twain",
    actionStep: "Start the task you have been delaying for only five minutes."
  }
];

const quoteCategory = document.getElementById("quoteCategory");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");const actionStep = document.getElementById("actionStep");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");

function getRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

function displayQuote() {
  const quote = getRandomQuote();
  quoteCategory.textContent = quote.category;
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = "— " + quote.author;
  actionStep.textContent = quote.actionStep;
}

function getQuoteForSharing() {
  return '"' + quoteText.textContent + '" ' + quoteAuthor.textContent +
    "\n\nAction Step: " + actionStep.textContent +
    "\n\nThe Motivation Hub";
}

generateBtn.addEventListener("click", displayQuote);

copyBtn.addEventListener("click", async function () {
  try {
    await navigator.clipboard.writeText(getQuoteForSharing());
    copyBtn.textContent = "Copied";
  } catch (error) {
    copyBtn.textContent = "Copy Failed";
  }
  setTimeout(function () { copyBtn.textContent = "Copy"; }, 2000);
});

shareBtn.addEventListener("click", async function () {
  const text = getQuoteForSharing();
  if (navigator.share) {
    try {
      await navigator.share({ title: "The Motivation Hub", text: text });
    } catch (error) {}
  } else {
    try {
      await navigator.clipboard.writeText(text);
      shareBtn.textContent = "Copied";
    } catch (error) {
      shareBtn.textContent = "Share Failed";
    }    setTimeout(function () { shareBtn.textContent = "Share"; }, 2000);
  }
});

displayQuote();

/* ================= DROPDOWN MENU ================= */

const menuBtn = document.getElementById("menuBtn");
const dropdownMenu = document.getElementById("dropdownMenu");

menuBtn.addEventListener("click", function (event) {
  event.stopPropagation();
  dropdownMenu.classList.toggle("hidden");
});

document.addEventListener("click", function (event) {
  if (!dropdownMenu.classList.contains("hidden") && !dropdownMenu.contains(event.target)) {
    dropdownMenu.classList.add("hidden");
  }
});

dropdownMenu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () {
    dropdownMenu.classList.add("hidden");
  });
});

/* ================= BOTTOM MENU ACTIVE STATE ================= */

const bottomLinks = document.querySelectorAll(".bottom-nav a");

bottomLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    bottomLinks.forEach(function (l) { l.classList.remove("active"); });
    link.classList.add("active");
  });
});

/* ================= PWA INSTALL PROMPT ================= */

const installBanner = document.getElementById("installBanner");
const installBtn = document.getElementById("installBtn");
const installClose = document.getElementById("installClose");
const installHint = document.getElementById("installHint");

let deferredPrompt = null;

const isStandalone =
  window.matchMedia("(display-mode: standalone)").matches ||  window.navigator.standalone;

const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());

/* If the app is opened from the home screen, mark it as installed */
if (isStandalone) {
  localStorage.setItem("tmh_installed", "yes");
}

const isInstalled = localStorage.getItem("tmh_installed") === "yes";

function showInstallBanner() {
  /* Show on EVERY visit until the app is installed */
  if (!isStandalone && !isInstalled) {
    installBanner.classList.remove("hidden");
  }
}

function hideInstallBanner() {
  installBanner.classList.add("hidden");
}

window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  deferredPrompt = event;
  showInstallBanner();
});

/* When the user installs the app, stop the banner forever */
window.addEventListener("appinstalled", function () {
  localStorage.setItem("tmh_installed", "yes");
  hideInstallBanner();
});

installBtn.addEventListener("click", async function () {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      localStorage.setItem("tmh_installed", "yes");
      hideInstallBanner();
    }
    deferredPrompt = null;
  } else {
    /* No native prompt available: show manual instructions */
    if (isIOS) {
      installHint.textContent = 'Tap the Share button, then choose "Add to Home Screen".';
    } else {
      installHint.textContent = 'Tap your browser menu (⋮), then choose "Install app" or "Add to Home screen".';
    }  }
});

/* ✕ only hides it for THIS visit. It returns on the next visit. */
installClose.addEventListener("click", hideInstallBanner);

/* Show the banner on every page load */
window.addEventListener("load", function () {
  setTimeout(showInstallBanner, 1200);
});

/* ================= SERVICE WORKER (PWA) ================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js");
  });
}
/* ================= HABIT TRACKER ================= */

const HABITS_KEY = "tmh_habits";

const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const quickHabits = document.getElementById("quickHabits");
const habitList = document.getElementById("habitList");
const emptyHabits = document.getElementById("emptyHabits");
const habitMessage = document.getElementById("habitMessage");

let habits = loadHabits();

const QUICK_HABITS = [
  "Wake up early",
  "Read 10 pages",
  "Exercise",
  "Pray",
  "Drink water",
  "Save money",
  "Sleep early"
];

function loadHabits() {
  try {
    return JSON.parse(localStorage.getItem(HABITS_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveHabits() {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function currentStreak(habit) {
  const d = new Date();
  if (!habit.dates[dateKey(d)]) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (habit.dates[dateKey(d)]) {
    streak++;
    d.setDate(d.getDate() - 1);
  }  return streak;
}

function badgeFor(streak) {
  if (streak >= 30) return "💎";
  if (streak >= 21) return "🥇";
  if (streak >= 7) return "🥈";
  if (streak >= 3) return "🥉";
  return "";
}

function weekDots(habit) {
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  let html = "";
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const on = habit.dates[dateKey(d)] ? " on" : "";
    const today = i === 0 ? " today" : "";
    html += '<span class="dot' + on + today + '">' + labels[d.getDay()] + "</span>";
  }
  return html;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMessage(text) {
  habitMessage.textContent = text;
  habitMessage.classList.remove("hidden");
  setTimeout(function () {
    habitMessage.classList.add("hidden");
  }, 3000);
}

function renderHabits() {
  if (habits.length === 0) {
    habitList.innerHTML = "";
    emptyHabits.classList.remove("hidden");
    return;
  }

  emptyHabits.classList.add("hidden");

  habitList.innerHTML = habits.map(function (habit) {
    const streak = currentStreak(habit);
    const doneToday = !!habit.dates[dateKey(new Date())];    const broken = streak === 0 && Object.keys(habit.dates).length > 0;
    const badge = badgeFor(streak);

    return (
      '<div class="habit-item" data-id="' + habit.id + '">' +
        '<button class="habit-check' + (doneToday ? " done" : "") + '" data-action="toggle" aria-label="Mark habit done">✓</button>' +
        '<div class="habit-info">' +
          '<div class="habit-name">' + escapeHtml(habit.name) + "</div>" +
          '<div class="habit-week">' + weekDots(habit) + "</div>" +
          (broken && !doneToday ? '<div class="repair">Missed a day? Restart today 💪</div>' : "") +
        "</div>" +
        '<div class="habit-streak">' +
          (badge ? '<span class="badge-emoji">' + badge + "</span>" : "") +
          "🔥 " + streak +
        "</div>" +
        '<button class="habit-delete" data-action="delete" aria-label="Delete habit">✕</button>' +
      "</div>"
    );
  }).join("");
}

function addHabit(name) {
  const clean = name.trim();
  if (!clean) return;

  habits.push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: clean,
    dates: {}
  });

  saveHabits();
  renderHabits();
  showMessage("Habit added. Start your streak today! 🌱");
}

addHabitBtn.addEventListener("click", function () {
  addHabit(habitInput.value);
  habitInput.value = "";
});

habitInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addHabit(habitInput.value);
    habitInput.value = "";
  }
});

quickHabits.innerHTML = QUICK_HABITS.map(function (name) {
  return '<button class="chip">' + name + "</button>";}).join("");

quickHabits.addEventListener("click", function (event) {
  if (event.target.classList.contains("chip")) {
    addHabit(event.target.textContent);
  }
});

habitList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const item = button.closest(".habit-item");
  const id = item.getAttribute("data-id");
  const habit = habits.find(function (h) { return h.id === id; });
  if (!habit) return;

  const action = button.getAttribute("data-action");

  if (action === "toggle") {
    const key = dateKey(new Date());

    if (habit.dates[key]) {
      delete habit.dates[key];
    } else {
      habit.dates[key] = true;
      const streak = currentStreak(habit);

      if (streak === 3) showMessage('🥉 3-day streak on "' + habit.name + '"! Keep going!');
      else if (streak === 7) showMessage("🥈 7 days! One full week of discipline!");
      else if (streak === 21) showMessage("🥇 21 days! You are becoming a new person!");
      else if (streak === 30) showMessage("💎 30 days! This is now your lifestyle!");
      else showMessage("✅ Done! Streak: " + streak + " day" + (streak === 1 ? "" : "s") + ".");
    }

    saveHabits();
    renderHabits();
  }

  if (action === "delete") {
    if (confirm('Delete "' + habit.name + '"?')) {
      habits = habits.filter(function (h) { return h.id !== id; });
      saveHabits();
      renderHabits();
    }
  }
});

renderHabits();
/* ================= GOAL PLANNER ================= */

const GOALS_KEY = "tmh_goals";

const goalTabs = document.getElementById("goalTabs");
const goalPanels = document.getElementById("goalPanels");
const goalMessage = document.getElementById("goalMessage");
const printPlanBtn = document.getElementById("printPlanBtn");
const printDate = document.getElementById("printDate");

const GOAL_LEVELS = [
  { key: "daily", label: "Day", title: "Daily Tasks", placeholder: "Add a task for today e.g. Read 10 pages" },
  { key: "weekly", label: "Week", title: "Weekly Goals", placeholder: "Add a weekly goal e.g. Exercise 3 times" },
  { key: "monthly", label: "Month", title: "Monthly Goals", placeholder: "Add a monthly goal e.g. Finish 2 books" },
  { key: "yearly", label: "Year", title: "Yearly Goals", placeholder: "Add a yearly goal e.g. Read 12 books" }
];

let goals = loadGoals();
let activeLevel = "daily";

function loadGoals() {
  let data = {};
  try {
    data = JSON.parse(localStorage.getItem(GOALS_KEY)) || {};
  } catch (error) {
    data = {};
  }
  GOAL_LEVELS.forEach(function (level) {
    if (!Array.isArray(data[level.key])) data[level.key] = [];
  });
  return data;
}

function saveGoals() {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
}

function showGoalMessage(text) {
  goalMessage.textContent = text;
  goalMessage.classList.remove("hidden");
  setTimeout(function () {
    goalMessage.classList.add("hidden");
  }, 3000);
}

function renderGoalTabs() {
  goalTabs.innerHTML = GOAL_LEVELS.map(function (level) {
    return (
      '<button class="goal-tab' + (level.key === activeLevel ? " active" : "") + '" data-level="' + level.key + '">' +
        level.label +      "</button>"
    );
  }).join("");
}

function renderGoalPanels() {
  goalPanels.innerHTML = GOAL_LEVELS.map(function (level) {
    const list = goals[level.key];
    const done = list.filter(function (g) { return g.done; }).length;
    const percent = list.length ? Math.round((done / list.length) * 100) : 0;

    const items = list.length
      ? list.map(function (g) {
          return (
            '<div class="goal-item' + (g.done ? " is-done" : "") + '" data-id="' + g.id + '">' +
              '<button class="goal-check' + (g.done ? " done" : "") + '" data-action="toggle">✓</button>' +
              '<span class="goal-text">' + escapeHtml(g.text) + "</span>" +
              '<button class="goal-edit" data-action="edit">✎</button>' +
              '<button class="goal-delete" data-action="delete">✕</button>' +
            "</div>"
          );
        }).join("")
      : '<p class="goal-empty">Nothing here yet. Add your first one above. 🎯</p>';

    return (
      '<div class="goal-panel' + (level.key === activeLevel ? "" : " hidden") + '" data-level="' + level.key + '">' +
        '<h3 class="panel-title">' + level.title + "</h3>" +
        '<div class="goal-add">' +
          '<input data-input="' + level.key + '" maxlength="80" placeholder="' + level.placeholder + '" />' +
          '<button class="btn btn-primary" data-add="' + level.key + '">Add</button>' +
        "</div>" +
        '<div class="progress"><span style="width:' + percent + '%"></span></div>' +
        '<p class="progress-text">' + done + " of " + list.length + " completed (" + percent + "%)</p>" +
        '<div class="goal-list">' + items + "</div>" +
      "</div>"
    );
  }).join("");
}

function addGoal(level, text) {
  const clean = text.trim();
  if (!clean) return;

  goals[level].push({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: clean,
    done: false
  });

  saveGoals();  renderGoalPanels();
  showGoalMessage("Goal added. Break it into smaller steps! 🎯");
}

goalTabs.addEventListener("click", function (event) {
  const tab = event.target.closest(".goal-tab");
  if (!tab) return;
  activeLevel = tab.getAttribute("data-level");
  renderGoalTabs();
  renderGoalPanels();
});

goalPanels.addEventListener("click", function (event) {
  const addBtn = event.target.closest("button[data-add]");
  if (addBtn) {
    const level = addBtn.getAttribute("data-add");
    const input = goalPanels.querySelector('input[data-input="' + level + '"]');
    addGoal(level, input.value);
    input.value = "";
    return;
  }

  const actionBtn = event.target.closest("button[data-action]");
  if (!actionBtn) return;

  const item = actionBtn.closest(".goal-item");
  const id = item.getAttribute("data-id");
  const levelKey = actionBtn.closest(".goal-panel").getAttribute("data-level");
  const goal = goals[levelKey].find(function (g) { return g.id === id; });
  if (!goal) return;

  const action = actionBtn.getAttribute("data-action");

  if (action === "toggle") {
    goal.done = !goal.done;
    if (goal.done) showGoalMessage("🎯 Completed! Great work.");
    saveGoals();
    renderGoalPanels();
  }

  if (action === "edit") {
    const newText = prompt("Edit goal:", goal.text);
    if (newText && newText.trim()) {
      goal.text = newText.trim();
      saveGoals();
      renderGoalPanels();
    }
  }

  if (action === "delete") {    if (confirm('Delete "' + goal.text + '"?')) {
      goals[levelKey] = goals[levelKey].filter(function (g) { return g.id !== id; });
      saveGoals();
      renderGoalPanels();
    }
  }
});

goalPanels.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && event.target.matches("input[data-input]")) {
    const level = event.target.getAttribute("data-input");
    addGoal(level, event.target.value);
    event.target.value = "";
  }
});

printPlanBtn.addEventListener("click", function () {
  printDate.textContent = "Printed on " + new Date().toDateString();
  window.print();
});

renderGoalTabs();
renderGoalPanels();