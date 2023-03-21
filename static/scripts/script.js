palette = document.getElementById("PrimaryPalette").getElementsByTagName("div");
let colorCards = document.getElementsByClassName("color-card");
let urlCards = document.getElementsByClassName("text-card");
let paletteFren = document.getElementById("palette-friend");
let favoritesButton = document.getElementById("favorites");
let titletoo = document.getElementById("menu-title-fren");
let paletteText = document.getElementById("palette-text");
let favoriteButton = document.getElementById("favorite");
let favButton = document.getElementById("fav-create");
let title = document.getElementById("menu-title-sec");

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

function GenerateHex() {
  chars = "0123456789abcdef";
  var c1 = "";
  for (i = 0; i < 6; i++) {
    c1 = c1 + chars[Math.floor(Math.random() * 16)];
  }
  return "#" + c1;
}
function RefreshPalette() {
  favoriteButton.getElementsByTagName("svg")[0].style.fill = "transparent";
  favoriteButton.style.background = "transparent";
  for (let i = 0; i < palette.length; i++) {
    elem = palette[i];
    ColorHex = GenerateHex();
    elem.id = ColorHex;
    elem.style.background = ColorHex;
    elem.innerHTML = ColorHex;
  }
}

// Buttons

favoriteButton.addEventListener("click", () => {
  fetch(
    `/favorites?c1=${colorCards[0].id.replace(
      "#",
      ""
    )}&c2=${colorCards[1].id.replace("#", "")}&c3=${colorCards[2].id.replace(
      "#",
      ""
    )}&c4=${colorCards[3].id.replace("#", "")}&c5=${colorCards[4].id.replace(
      "#",
      ""
    )}&prompt=null`,
    { method: "POST" }
  );
  favoriteButton.style.background = "linear-gradient(#2E3C7B, #665B8A)";
  favoriteButton.getElementsByTagName("svg")[0].style.fill = "white";
});

favoritesButton.addEventListener("click", () => {
  window.location.href = `/favorites`;
});

favButton.addEventListener("click", () => {
  fetch(
    `/favorites?c1=${urlCards[0].id.replace(
      "#",
      ""
    )}&c2=${urlCards[1].id.replace("#", "")}&c3=${urlCards[2].id.replace(
      "#",
      ""
    )}&c4=${urlCards[3].id.replace("#", "")}&c5=${urlCards[4].id.replace(
      "#",
      ""
    )}&prompt=${paletteText.value}`,
    { method: "POST" }
  );
  favButton.style.background = "linear-gradient(#2E3C7B, #665B8A)";
  favButton.getElementsByTagName("svg")[0].style.fill = "white";
});

// Inputs

paletteText.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    var num = 0;
    favButton.getElementsByTagName("svg")[0].style.fill = "transparent";
    favButton.style.background = "transparent";
    title.innerHTML = `...`;
    try {
      let resp = await fetch(
        `https://palettes.deta.dev/text/palette?text=${paletteText.value}`
      );
      let data = await resp.json();
      for (card of urlCards) {
        card.innerHTML = data.colors[num];
        card.style.background = data.colors[num];
        card.id = data.colors[num];
        num = num + 1;
      }
      title.innerHTML = `Create`;
    } catch {
      title.innerHTML = `!...`;
      try {
        let resp = await fetch(
          `https://palettes.deta.dev/ai/palette?text=${paletteText.value}`
        );
        let data = await resp.json();
        for (card of urlCards) {
          card.innerHTML = data.colors[num];
          card.style.background = data.colors[num];
          card.id = data.colors[num];
          num = num + 1;
        }
        title.innerHTML = `Create`;
      } catch {
        title.innerHTML = `Error`;
      }
    }
  }
});

paletteFren.addEventListener("keypress", async (event) => {
  if (event.key === "Enter") {
    titletoo.innerHTML = `...`;
    let resp = await fetch(paletteFren.value);
    let data = await resp.json();
    await fetch(
      `/favorites?c1=${data.colors[1].replace(
        "#",
        ""
      )}&c2=${data.colors[2].replace("#", "")}&c3=${data.colors[3].replace(
        "#",
        ""
      )}&c4=${data.colors[4].replace("#", "")}&c5=${data.colors[5].replace(
        "#",
        ""
      )}&prompt=null`,
      { method: "POST" }
    );
    titletoo.innerHTML = `Saved!`;
  }
});
