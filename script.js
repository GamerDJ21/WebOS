const notesWindow = document.querySelector("#notes");
const notesHeader = document.querySelector("#notesheader");
const notesOpenButton = document.querySelector("#notesopen");
const notesCloseButton = document.querySelector("#notesclose");
const notesTaskbarButton = document.querySelector("#notesTaskbar");
const notesContent = document.querySelector("#notesContent");
const desktop = document.querySelector(".desktop");
const timeElement = document.querySelector("#timeElement");
const startButton = document.querySelector("#startButton");
const startMenu = document.querySelector("#startMenu");
const menuNotesButton = document.querySelector("#menuNotes");

let highestWindowLayer = 1;

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

updateTime();
setInterval(updateTime, 1000);