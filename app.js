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
const quoteAuthor = document.getElementById("quoteAuthor");
const actionStep = document.getElementById("actionStep");
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
  return `"${quoteText.textContent}" ${quoteAuthor.textContent}\n\nAction Step: ${actionStep.textContent}\n\nThe Motivation Hub`;
}

generateBtn.addEventListener("click", displayQuote);

copyBtn.addEventListener("click", async function () {
  const text = getQuoteForSharing();

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = "Copied";
  } catch (error) {
    copyBtn.textContent = "Copy Failed";
  }

  setTimeout(function () {
    copyBtn.textContent = "Copy";
  }, 2000);
});

shareBtn.addEventListener("click", async function () {
  const text = getQuoteForSharing();

  if (navigator.share) {
    try {
      await navigator.share({
        title: "The Motivation Hub",
        text: text
      });
    } catch (error) {
      // User closed the share box    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      shareBtn.textContent = "Copied";
    } catch (error) {
      shareBtn.textContent = "Share Failed";
    }

    setTimeout(function () {
      shareBtn.textContent = "Share";
    }, 2000);
  }
});

displayQuote();