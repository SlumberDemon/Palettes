let colorCards = document.getElementsByClassName("color-card");
let infoButton = document.getElementById("info");

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

infoButton.addEventListener("click", () => {
    window.location.href = `https://palletes.deta.dev`

})