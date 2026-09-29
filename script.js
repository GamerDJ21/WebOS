const notesWindow = document.querySelector("#notes");
const notesHeader = document.querySelector("#notesheader");
const notesOpenButton = document.querySelector("#notesopen");
const notesCloseButton = document.querySelector("#notesclose");
const notesTaskbarButton = document.querySelector("#notesTaskbar");
const notesContent = document.querySelector("#notesContent");
const browserWindow = document.querySelector("#browser");
const browserHeader = document.querySelector("#browserheader");
const browserOpenButton = document.querySelector("#browseropen");
const browserCloseButton = document.querySelector("#browserclose");
const browserTaskbarButton = document.querySelector("#browserTaskbar");
const browserForm = document.querySelector("#browserForm");
const browserAddress = document.querySelector("#browserAddress");
const browserFrame = document.querySelector("#browserFrame");
const browserWelcome = document.querySelector("#browserWelcome");
const browserBackButton = document.querySelector("#browserBack");
const browserForwardButton = document.querySelector("#browserForward");
const browserReloadButton = document.querySelector("#browserReload");
const browserNewTabButton = document.querySelector("#browserNewTab");
const desktop = document.querySelector(".desktop");
const timeElement = document.querySelector("#timeElement");
const startButton = document.querySelector("#startButton");
const startMenu = document.querySelector("#startMenu");
const menuNotesButton = document.querySelector("#menuNotes");
const menuBrowserButton = document.querySelector("#menuBrowser");
const calculatorWindow = document.querySelector("#calculator");
const calculatorHeader = document.querySelector("#calculatorheader");
const calculatorOpenButton = document.querySelector("#calculatoropen");
const calculatorCloseButton = document.querySelector("#calculatorclose");
const calculatorTaskbarButton = document.querySelector("#calculatorTaskbar");
const calculatorDisplay = document.querySelector("#calculatorDisplay");
const calculatorButtons = document.querySelectorAll(".calculator-buttons button, .clear-buttons button");

let highestWindowLayer = 1;
let browserHistory = [];
let browserHistoryIndex = -1;

function updateTime() {
  timeElement.textContent = new Date().toLocaleString();
}

function openNotes() {
  closeStartMenu();
  notesWindow.hidden = false;
  notesWindow.setAttribute("aria-hidden", "false");
  notesTaskbarButton.classList.add("is-open");
  highestWindowLayer += 1;
  notesWindow.style.zIndex = highestWindowLayer;
  notesContent.focus();
}

function closeNotes() {
  notesWindow.hidden = true;
  notesWindow.setAttribute("aria-hidden", "true");
  notesTaskbarButton.classList.remove("is-open");
  notesOpenButton.focus();
}

function openBrowser() {
  closeStartMenu();
  browserWindow.hidden = false;
  browserWindow.setAttribute("aria-hidden", "false");
  browserTaskbarButton.classList.add("is-open");
  highestWindowLayer += 1;
  browserWindow.style.zIndex = highestWindowLayer;
  browserAddress.focus();
}

function closeBrowser() {
  browserWindow.hidden = true;
  browserWindow.setAttribute("aria-hidden", "true");
  browserTaskbarButton.classList.remove("is-open");
  browserOpenButton.focus();
}

function normalizeBrowserAddress(value) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return "";

  if (/^https?:\/\//i.test(trimmedValue)) {
    try {
      return new URL(trimmedValue).href;
    } catch {
      return "";
    }
  }

  if (/^(localhost(?::\d+)?|(?:[\w-]+\.)+[a-z]{2,}(?::\d+)?)(?:\/.*)?$/i.test(trimmedValue)) {
    return `https://${trimmedValue}`;
  }

  return `https://www.google.com/search?q=${encodeURIComponent(trimmedValue)}`;
}

function updateBrowserHistoryControls() {
  browserBackButton.disabled = browserHistoryIndex <= 0;
  browserForwardButton.disabled = browserHistoryIndex >= browserHistory.length - 1;
}

function navigateBrowser(url, addToHistory = true) {
  if (!url) {
    browserAddress.setCustomValidity("Enter a web address or search term.");
    browserAddress.reportValidity();
    return;
  }

  browserAddress.setCustomValidity("");
  if (addToHistory) {
    browserHistory = browserHistory.slice(0, browserHistoryIndex + 1);
    browserHistory.push(url);
    browserHistoryIndex = browserHistory.length - 1;
  }
  browserAddress.value = url;
  browserWelcome.hidden = true;
  browserFrame.hidden = false;
  browserFrame.src = url;
  updateBrowserHistoryControls();
}

function openCalculator() {
  closeStartMenu();
  calculatorWindow.hidden = false;
  calculatorWindow.setAttribute("aria-hidden", "false");
  calculatorTaskbarButton.classList.add("is-open");
  highestWindowLayer += 1;
  calculatorWindow.style.zIndex = highestWindowLayer;
  calculatorDisplay.focus();
}

function closeCalculator() {
  calculatorWindow.hidden = true;
  calculatorWindow.setAttribute("aria-hidden", "true");
  calculatorTaskbarButton.classList.remove("is-open");
  calculatorOpenButton.focus();
}

function handleCalculatorButtonClick(event) {
  const buttonValue = event.target.getAttribute("data-value") || event.target.value;
  if (!buttonValue) return;

  if (buttonValue === "=") {
    const expression = calculatorDisplay.value.trim();
    if (!expression) return;

    try {
      const result = Function(`"use strict"; return (${expression});`)();
      calculatorDisplay.value = Number.isFinite(result) ? String(result) : "Error";
    } catch {
      calculatorDisplay.value = "Error";
    }
  } else if (buttonValue === "C") {
    calculatorDisplay.value = "";
  } else if (buttonValue === "CE") {
    calculatorDisplay.value = calculatorDisplay.value.slice(0, -1);
  } else {
    if (calculatorDisplay.value === "Error") {
      calculatorDisplay.value = "";
    }
    calculatorDisplay.value += buttonValue;
  }
}

calculatorButtons.forEach((button) => {
  button.addEventListener("click", handleCalculatorButtonClick);
});

function closeStartMenu() {
  startMenu.hidden = true;
  startButton.setAttribute("aria-expanded", "false");
}

function toggleStartMenu() {
  startMenu.hidden = !startMenu.hidden;
  startButton.setAttribute("aria-expanded", String(!startMenu.hidden));
}

notesOpenButton.addEventListener("click", openNotes);
notesTaskbarButton.addEventListener("click", openNotes);
notesCloseButton.addEventListener("click", closeNotes);
menuNotesButton.addEventListener("click", openNotes);
calculatorOpenButton.addEventListener("click", openCalculator);
if (calculatorTaskbarButton) {
  calculatorTaskbarButton.addEventListener("click", openCalculator);
}
calculatorCloseButton.addEventListener("click", closeCalculator);
browserOpenButton.addEventListener("click", openBrowser);
browserTaskbarButton.addEventListener("click", openBrowser);
browserCloseButton.addEventListener("click", closeBrowser);
menuBrowserButton.addEventListener("click", openBrowser);
browserForm.addEventListener("submit", (event) => {
  event.preventDefault();
  navigateBrowser(normalizeBrowserAddress(browserAddress.value));
});
browserAddress.addEventListener("input", () => browserAddress.setCustomValidity(""));
browserBackButton.addEventListener("click", () => {
  if (browserHistoryIndex <= 0) return;
  browserHistoryIndex -= 1;
  navigateBrowser(browserHistory[browserHistoryIndex], false);
});
browserForwardButton.addEventListener("click", () => {
  if (browserHistoryIndex >= browserHistory.length - 1) return;
  browserHistoryIndex += 1;
  navigateBrowser(browserHistory[browserHistoryIndex], false);
});
browserReloadButton.addEventListener("click", () => {
  if (browserHistoryIndex >= 0) browserFrame.src = browserHistory[browserHistoryIndex];
});
browserNewTabButton.addEventListener("click", () => {
  if (browserHistoryIndex >= 0) window.open(browserHistory[browserHistoryIndex], "_blank", "noopener,noreferrer");
});
startButton.addEventListener("click", toggleStartMenu);
document.addEventListener("pointerdown", (event) => {
  if (!startMenu.hidden && !startMenu.contains(event.target) && !startButton.contains(event.target)) {
    closeStartMenu();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !startMenu.hidden) {
    closeStartMenu();
    startButton.focus();
  }
});
notesWindow.addEventListener("pointerdown", () => {
  highestWindowLayer += 1;
  notesWindow.style.zIndex = highestWindowLayer;
});

browserWindow.addEventListener("pointerdown", () => {
  highestWindowLayer += 1;
  browserWindow.style.zIndex = highestWindowLayer;
});

notesHeader.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  const windowRect = notesWindow.getBoundingClientRect();
  const desktopTop = desktop.getBoundingClientRect().top;
  const pointerOffsetX = event.clientX - windowRect.left;
  const pointerOffsetY = event.clientY - windowRect.top;

  notesHeader.setPointerCapture(event.pointerId);
  notesHeader.onpointermove = (moveEvent) => {
    const left = Math.max(0, Math.min(moveEvent.clientX - pointerOffsetX, window.innerWidth - notesWindow.offsetWidth));
    const top = Math.max(0, Math.min(moveEvent.clientY - pointerOffsetY - desktopTop, window.innerHeight - desktopTop - notesWindow.offsetHeight));
    notesWindow.style.left = `${left}px`;
    notesWindow.style.top = `${top}px`;
  };
});

notesHeader.addEventListener("pointerup", () => {
  notesHeader.onpointermove = null;
});

notesHeader.addEventListener("pointercancel", () => {
  notesHeader.onpointermove = null;
});

browserHeader.addEventListener("pointerdown", (event) => {
  if (event.target.closest("button")) return;

  const windowRect = browserWindow.getBoundingClientRect();
  const desktopTop = desktop.getBoundingClientRect().top;
  const pointerOffsetX = event.clientX - windowRect.left;
  const pointerOffsetY = event.clientY - windowRect.top;

  browserHeader.setPointerCapture(event.pointerId);
  browserHeader.onpointermove = (moveEvent) => {
    const left = Math.max(0, Math.min(moveEvent.clientX - pointerOffsetX, window.innerWidth - browserWindow.offsetWidth));
    const top = Math.max(0, Math.min(moveEvent.clientY - pointerOffsetY - desktopTop, window.innerHeight - desktopTop - browserWindow.offsetHeight));
    browserWindow.style.left = `${left}px`;
    browserWindow.style.top = `${top}px`;
  };
});

browserHeader.addEventListener("pointerup", () => {
  browserHeader.onpointermove = null;
});

browserHeader.addEventListener("pointercancel", () => {
  browserHeader.onpointermove = null;
});

updateTime();
setInterval(updateTime, 1000);