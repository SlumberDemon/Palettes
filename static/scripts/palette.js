let colorCards = document.getElementsByClassName("color-card");
let apiButtons = document.getElementsByClassName("api");
let infoButton = document.getElementById("info");

// Color Card

document.addEventListener("DOMContentLoaded", () => {
  for (let card of colorCards) {
    card.style.background = card.id;
  }
});

for (let card of colorCards) {
  card.addEventListener("click", () => {
    navigator.clipboard.writeText(card.id);
    card.innerHTML = "Copied";
    setTimeout(() => {
      card.innerHTML = card.id;
    }, 250);
  });
}

// Buttons

infoButton.addEventListener("click", () => {
  window.location.href = `https://palettes.deta.dev`;
});

for (let button of apiButtons) {
  button.addEventListener("click", () => {
    let url = `${window.location.origin}/api/palette/${button.id}`;
    navigator.clipboard.writeText(url);
    button.style.background = "linear-gradient(#2E3C7B, #665B8A)";
    setTimeout(() => {
      button.style.background = "transparent";
    }, 800);
  });
}
