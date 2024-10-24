const homeScore = document.getElementById("home-score")

const guestScore = document.getElementById("guest-score")

function addPointHome(){
    homeScore.textContent = parseInt(homeScore.textContent) + 1
}

function addPointGuest(){
    guestScore.textContent = parseInt(guestScore.textContent) + 1
}

function addDoubleHome(){
    homeScore.textContent = parseInt(homeScore.textContent) + 2
}

function addDoubleGuest(){
    guestScore.textContent = parseInt(guestScore.textContent) + 2
}


function addTripleHome(){
    homeScore.textContent = parseInt(homeScore.textContent) + 3
}

function addTripleGuest(){
    guestScore.textContent = parseInt(guestScore.textContent) + 3
}