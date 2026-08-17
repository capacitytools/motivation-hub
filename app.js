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

function showInstallBanner() {
  const dismissed = localStorage.getItem("tmh_install_dismissed");
  if (!isStandalone && !dismissed) {
    installBanner.classList.remove("hidden");
  }
}

function hideInstallBanner(permanent) {
  installBanner.classList.add("hidden");
  if (permanent) {
    localStorage.setItem("tmh_install_dismissed", "yes");
  }
}

window.addEventListener("beforeinstallprompt", function (event) {
  event.preventDefault();
  deferredPrompt = event;
  showInstallBanner();
});

window.addEventListener("appinstalled", function () {
  hideInstallBanner(true);
});

installBtn.addEventListener("click", async function () {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      hideInstallBanner(true);
    }
    deferredPrompt = null;
  } else {
    if (isIOS) {
      installHint.textContent = 'Tap the Share button, then choose "Add to Home Screen".';
    } else {
      installHint.textContent = 'Tap your browser menu (⋮), then choose "Install app" or "Add to Home screen".';
    }
  }
});

installClose.addEventListener("click", function () {
  hideInstallBanner(true);
});

/* Show banner on first visit */window.addEventListener("load", function () {
  setTimeout(showInstallBanner, 1200);
});

/* ================= SERVICE WORKER (PWA) ================= */

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js");
  });
}