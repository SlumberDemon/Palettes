let colorCards = document.getElementsByClassName("color-card");
let urlInput = document.getElementById("palette-text");
let urlCards = document.getElementsByClassName("text-card");
let favoritesButton = document.getElementById("favorites");
let favoriteButton = document.getElementById("favorite");
let refreshButton = document.getElementById("refresh");
let favButton = document.getElementById("fav-create");

// Color Card

document.addEventListener("DOMContentLoaded", () => {
    for (let card of colorCards) {
        card.style.background=card.id;
    }
})

for (let card of colorCards) {
    card.addEventListener("click", () => {
        navigator.clipboard.writeText(card.id);
        card.innerHTML = "Copied";
        setTimeout(() => {
            card.innerHTML = card.id
        }, 250)
    })
}

// Buttons

favoriteButton.addEventListener("click", () => {
    fetch(`/favorites?color1=${colorCards[0].id.replace("#", "")}&color2=${colorCards[1].id.replace("#", "")}&color3=${colorCards[2].id.replace("#", "")}&color4=${colorCards[3].id.replace("#", "")}&color5=${colorCards[4].id.replace("#", "")}`, { method: "POST" })
    favoriteButton.style.background="linear-gradient(#2E3C7B, #665B8A)";
})

favoritesButton.addEventListener("click", () => {
    window.location.href = `/favorites`
})

refreshButton.addEventListener("click", () => {
    location.reload()
})

favButton.addEventListener("click", () => {
    fetch(`/favorites?color1=${urlCards[0].id.replace("#", "")}&color2=${urlCards[1].id.replace("#", "")}&color3=${urlCards[2].id.replace("#", "")}&color4=${urlCards[3].id.replace("#", "")}&color5=${urlCards[4].id.replace("#", "")}`, { method: "POST" })
    favButton.style.background="linear-gradient(#2E3C7B, #665B8A)";
})


// Inputs

urlInput.addEventListener("keypress", async (event) => {
    let title = document.getElementById("menu-title-sec")
    var num = 0
    if (event.key === "Enter") {
        favButton.style.background="transparent";
        title.innerHTML = `...`
        try {
            let resp  = await fetch(`https://palettes.deta.dev/text/palette?text=${urlInput.value}`)
            let data = await resp.json()
            for (card of urlCards) {
                card.innerHTML = data.colors[num]
                card.style.background = data.colors[num]
                card.id = data.colors[num]
                num = num + 1
            }
            title.innerHTML = `Create`
        }
        catch {
            title.innerHTML = `Error`
        }
    }
})

