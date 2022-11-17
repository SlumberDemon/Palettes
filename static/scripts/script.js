let colorCards = document.getElementsByClassName("color-card");
let favoritesButton = document.getElementById("favorites");
let favoriteButton = document.getElementById("favorite");
let refreshButton = document.getElementById("refresh");

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
    favoriteButton.style.background="#353535"
})

favoritesButton.addEventListener("click", () => {
    window.location.href = `/favorites`
})

refreshButton.addEventListener("click", () => {
    location.reload()
})
