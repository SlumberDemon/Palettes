let colorCards = document.getElementsByClassName("color-card");
let deleteButtons = document.getElementsByClassName("delete");
let shareButtons = document.getElementsByClassName("share")
let homeButton = document.getElementById("home");

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

homeButton.addEventListener("click", () => {
    window.location.href = `/`
})

for (let button of deleteButtons) {
    button.addEventListener("click", () => {
        fetch(`/favorites?id=${button.id}`, { method: "DELETE" })
        location.reload()
    })
}

for (let button of deleteButtons) {
    button.addEventListener("click", () => {
        fetch(`/favorites?id=${button.id}`, { method: "DELETE" })
        location.reload()
    })
}

for (let button of shareButtons) {
    button.addEventListener("click", () => {
        let url = `${window.location.origin}/pallete/${button.id}`
        navigator.clipboard.writeText(url)
        button.style.background="#353535"
        setTimeout(() => {
            button.style.background="transparent"
        }, 800)
    })
}