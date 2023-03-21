//

pa = document.getElementById("PrimaryPalette").getElementsByTagName("div");

// let

let cCards = document.getElementsByClassName("color-card");
let fb = document.getElementById("favorite");

// Var

var commandPalette = document.getElementById("command-palette");
var commandSearch = document.getElementById("command-search");
var commandList = document.querySelector(".command-list");
var overlay = document.getElementById("overlay");
var selectedCommandIndex = 0;
var commandsCreated = false;

// Commands

var commands = [
  {
    name: "Generate new",
    icon: "refresh-cw",
    action: function () {
      RefreshPalette();
    },
  },
  {
    name: "Favorite palette",
    icon: "star",
    action: function () {
      FavPallete();
    },
  },
  {
    name: "Saved palettes",
    icon: "book",
    action: function () {
      OpenFav();
    },
  },
  {
    name: "Close",
    icon: "minimize-2",
    action: function () {
      closeMenu();
    },
  },
];

function createCommands() {
  commands.forEach(function (command, i) {
    var commandElement = document.createElement("div");
    var icon = document.createElement("i");
    icon.setAttribute("data-feather", command.icon);
    commandElement.appendChild(icon);
    var text = document.createElement("span");
    text.innerHTML = command.name;
    commandElement.appendChild(text);
    commandElement.addEventListener("click", command.action);
    commandList.appendChild(commandElement);
    commandElement.style.display = "flex";
    if (commandElement.innerHTML === "Close") {
      commandElement.classList.add("close-command");
    }
    if (i === selectedCommandIndex) {
      commandElement.classList.add("selected");
    }
  });
  feather.replace();
  commandsCreated = true;
}

function updateSelectedCommand() {
  var commandElements = commandList.querySelectorAll("div");
  commandElements.forEach(function (commandElement) {
    commandElement.classList.remove("selected");
  });
  commandElements[selectedCommandIndex].classList.add("selected");
  commandElements[selectedCommandIndex].scrollIntoView({ behavior: "smooth" });
}

// Functions

function closeMenu() {
  var commandElements = commandList.querySelectorAll("div");
  var selectedCommand = commandList.querySelector(".selected");
  if (selectedCommand) {
    selectedCommand.classList.remove("selected");
  }
  commandElements.forEach(function (commandElement) {
    commandElement.style.display = "flex";
  });
  overlay.style.display = "none";
  commandPalette.style.display = "none";
  commandList.style.height = "fit-content";
  commandSearch.value = "";
}

function openMenu() {
  if (commandPalette.style.display === "none") {
    overlay.style.display = "block";
    commandPalette.style.display = "block";
    commandSearch.style.display = "block";
    commandList.style.display = "block";
    if (!commandsCreated) createCommands();
  } else {
    closeMenu();
  }
}

/* Other functions */

function GenerateHex() {
  chars = "0123456789abcdef";
  var c1 = "";
  for (i = 0; i < 6; i++) {
    c1 = c1 + chars[Math.floor(Math.random() * 16)];
  }
  return "#" + c1;
}

function RefreshPalette() {
  fb.getElementsByTagName("svg")[0].style.fill = "transparent";
  fb.style.background = "transparent";
  for (let i = 0; i < pa.length; i++) {
    elem = pa[i];
    ColorHex = GenerateHex();
    elem.id = ColorHex;
    elem.style.background = ColorHex;
    elem.innerHTML = ColorHex;
  }
}

function FavPallete() {
  fetch(
    `/favorites?c1=${cCards[0].id.replace("#", "")}&c2=${cCards[1].id.replace(
      "#",
      ""
    )}&c3=${cCards[2].id.replace("#", "")}&c4=${cCards[3].id.replace(
      "#",
      ""
    )}&c5=${cCards[4].id.replace("#", "")}&prompt=null`,
    { method: "POST" }
  );
  fb.style.background = "linear-gradient(#2E3C7B, #665B8A)";
  fb.getElementsByTagName("svg")[0].style.fill = "white";
}

function OpenFav() {
  window.location.href = `/favorites`;
}

// Events

commandSearch.addEventListener("input", function () {
  var searchValue = this.value.toLowerCase();
  var commandElements = commandList.querySelectorAll("div");
  var visibleCommands = 0;

  commandElements.forEach(function (commandElement) {
    var commandName = commandElement
      .querySelector("span")
      .textContent.toLowerCase();

    if (
      commandName.includes(searchValue) ||
      commandName.startsWith(searchValue)
    ) {
      commandElement.style.display = "flex";
      visibleCommands++;
    } else {
      commandElement.style.display = "none";
    }
  });
  commandList.style.height = visibleCommands * 60 + "px";
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeMenu();
  }
});

document.addEventListener("keydown", function (event) {
  if (
    (event.metaKey && event.key === "k") ||
    (event.ctrlKey && event.key === "k")
  ) {
    openMenu();
  }
});

document.addEventListener("keydown", function (event) {
  if (commandPalette.style.display === "block") {
    if (event.key === "ArrowUp") {
      if (selectedCommandIndex > 0) {
        selectedCommandIndex--;
      }
      updateSelectedCommand();
      event.preventDefault();
    } else if (event.key === "ArrowDown") {
      if (selectedCommandIndex < commands.length - 1) {
        selectedCommandIndex++;
      }
      updateSelectedCommand();
      event.preventDefault();
    } else if (event.key === "Enter") {
      commands[selectedCommandIndex].action();
      event.preventDefault();
    }
  }
});
