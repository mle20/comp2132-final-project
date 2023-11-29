//Get all the buttons
const startGameButton = document.getElementById("startButton");
const playGameButton = document.getElementById("playButton");
const rollButton = document.getElementById("rollButton");
const resetButton = document.getElementById("resetButton");


//Setting the colour for the header to alternate the letter between red, yellow and purple.
window.onload = function() {
    const header = document.querySelector('.banner-header');
    const text = header.innerText;
    header.innerHTML = "";
    const colors = ['red', '#ECA40F', 'purple'];

    for (let i = 0; i < text.length; i++) {
        let span = document.createElement('span');
        span.style.color = colors[i % colors.length];
        span.textContent = text[i];
        header.appendChild(span);
    }

    rollButton.disabled = true;
    resetButton.disabled = true;
};

// Starting a new game and popup to select the characters
const popUp = document.getElementById("popUp");

function showPopup() {
    popUp.style.display = "block";
    setTimeout(() => {
        popUp.style.opacity = 1;
    }, 10); 
}

function hidePopup() {
    popUp.style.opacity = 0;
    setTimeout(() => {
        popUp.style.display = "none";
    }, 600); 
}

startGameButton.addEventListener("click", function () {
    showPopup();
});

playGameButton.addEventListener("click", function () {
    hidePopup();
    rollButton.disabled = false;
    resetButton.disabled = false;
});

//Setting the icon and name based on the player's selection.

const characterRadios = document.querySelectorAll("#characterSelect input[type='radio']");
const playerNameDisplay = document.querySelector("#player h2");
const playerIcon = document.getElementById("playerIcon");
const computerIcon = document.getElementById("computerIcon");
let playerName = "Player";

let teamMarioCharacters = ["mario", "luigi", "peach"];
let teamBowserCharacters = ["bowser", "koopa", "boo"];

function getChosenCharacter() {
    let chosenCharacter = "";
    characterRadios.forEach(radio => {
        if (radio.checked) {
            chosenCharacter = radio.value;
        }
    });
    return chosenCharacter;
}

function randomIconOppositeTeam(chosenTeam) {
    let oppositeTeam;

    if (chosenTeam === teamMarioCharacters) {
        oppositeTeam = teamBowserCharacters;
    } else {
        oppositeTeam = teamMarioCharacters;
    }

    const randomIndex = Math.floor(Math.random() * oppositeTeam.length);

    return oppositeTeam[randomIndex];
}

function updateIcons() {
    const chosenCharacter = getChosenCharacter();

    if (chosenCharacter) {
        let chosenTeam;

        if (teamMarioCharacters.includes(chosenCharacter)) {
            chosenTeam = teamMarioCharacters;
        } else {
            chosenTeam = teamBowserCharacters;
        }

        let playerIconElement = document.querySelector(`input[value="${chosenCharacter}"]`).nextElementSibling;
        playerIcon.src = playerIconElement.src;

        let computerCharacter = randomIconOppositeTeam(chosenTeam);

        let computerIconElement = document.querySelector(`input[value="${computerCharacter}"]`).nextElementSibling;
        computerIcon.src = computerIconElement.src;
    } else {
        playerIcon.src = "images/iconMario.png"; 
        computerIcon.src = "images/iconBowser.png";
    }
}


function updatePlayerName() {
    const userInput = document.getElementById("user").value.trim();

    if (userInput) {
        playerName = userInput; 
    } else {
        playerName = "Player"; 
    }

    playerNameDisplay.textContent = playerName;
}

playGameButton.addEventListener("click", function () {
    popUp.style.opacity = 0;
    setTimeout(() => {
        popUp.style.display = "none";
        updatePlayerName();
        updateIcons();
        startGameButton.disabled = true;
    }, 500);
});




// Rolling the dice and saving the results

let playerTotalScore = 0;
let computerTotalScore = 0;
let playerDiceRolls = [];
let computerDiceRolls = [];
let diceRollCount = 0;
let numberOfRolls = 0;

function rollDiceAnimation(diceId, isPlayer) {
    let diceElement = document.getElementById(diceId);

    for (let i = 0; i <= 10; i++) {
        setTimeout(function () {
            let randomNumber = Math.floor(Math.random() * 6) + 1;
            diceElement.src = `images/dice-0${randomNumber}.svg`;

            if (i === 10) {
                addDiceRollAndCheck(randomNumber, isPlayer);
            }
        }, i * 100);
    }
}


function calculateScore(diceValues) {
    if (diceValues[0] === 1 || diceValues[1] === 1) {
        return 0;
    } 
    else if (diceValues[0] === diceValues[1]) {
        return (diceValues[0] + diceValues[1]) * 2;
    } 
    else {
        return diceValues[0] + diceValues[1];
    }
}


function updateScoreDisplay(playerRoundScore, computerRoundScore) {
    document.getElementById("playerCurrentScore").textContent = playerRoundScore;
    document.getElementById("compCurrentScore").textContent = computerRoundScore;
    document.getElementById("playerTotalScore").textContent = playerTotalScore;
    document.getElementById("compTotalScore").textContent = computerTotalScore;
}


function totalScores() {
    playerTotalScore += calculateScore(playerDiceRolls);
    computerTotalScore += calculateScore(computerDiceRolls);

    updateScoreDisplay(playerTotalScore, computerTotalScore);
}

function displayOutcome() {
    let outcomeMessage = "";


    if (playerTotalScore > computerTotalScore && teamMarioCharacters.includes(getChosenCharacter())) {
        outcomeMessage += `<img src="images/mariowingif.gif" alt="Mario Dancing GIF">`;
        outcomeMessage += "<p>You Win!</p>";
    } else if (playerTotalScore > computerTotalScore && teamBowserCharacters.includes(getChosenCharacter())) {
        outcomeMessage += `<img src="images/bowserwin.gif" alt="Cool Bowser GIF">`;
        outcomeMessage += "<p>You Win!</p>";
    } else if (playerTotalScore < computerTotalScore  && teamMarioCharacters.includes(getChosenCharacter())) {
        outcomeMessage += `<img src="images/mariolosegif.gif" alt="Mario Lose GIF">`;
        outcomeMessage += "<p>You Lose!</p>";
    } else if (playerTotalScore < computerTotalScore && teamBowserCharacters.includes(getChosenCharacter())) {
        outcomeMessage += `<img src="images/bowserlosegif.gif" alt="Bowser Bowing GIF">`;
        outcomeMessage += "<p>You Lose!</p>";
    } else {
        outcomeMessage += `<img src="images/questionIcon.png" alt="Yellow Question Box.">`;
        outcomeMessage += "<p>It's a Tie, Play Again!</p>";
    }

    outcomeMessage += `<p>Score: ${playerName} - ${playerTotalScore}</p>`;
    outcomeMessage += `<p>Score: Computer - ${computerTotalScore}</p>`;
    document.getElementById("outcomeMessage").innerHTML = outcomeMessage;
    showOutcomePopup();
}

function gameResult() {
    numberOfRolls++;
    if (numberOfRolls === 3) {
        displayOutcome();
        numberOfRolls = 0;
        rollButton.disabled = true;
    }
}

function resetRolls() {
    playerDiceRolls = [];
    computerDiceRolls = [];
    diceRollCount = 0;
}

function addDiceRollAndCheck(randomNumber, isPlayer) {
    if (isPlayer) {
        playerDiceRolls.push(randomNumber);
    } else {
        computerDiceRolls.push(randomNumber);
    }

    diceRollCount++;

    if (diceRollCount > 3) {
        totalScores();
        gameResult();
        resetRolls();
    }
}


function showOutcomePopup() {
    let popup = document.getElementById("outcomePopup");
    popup.style.display = "block"; 
    setTimeout(() => {
        popup.style.opacity = 1;
    }, 10);
}

const closePopupButton = document.getElementById("closePopupButton");
closePopupButton.addEventListener("click", function () {
    let popup = document.getElementById("outcomePopup");
    popup.style.display = "none";
});

rollButton.addEventListener("click", function () {
    if (numberOfRolls < 3) {
        rollDiceAnimation("playerDice1", true);
        rollDiceAnimation("playerDice2", true);
        rollDiceAnimation("compDice1", false);
        rollDiceAnimation("compDice2", false);
    }
});


// Resetting the game to beginning

function resetGame() {
    playerTotalScore = 0;
    computerTotalScore = 0;
    playerDiceRolls = [];
    computerDiceRolls = [];
    diceRollCount = 0;
    numberOfRolls = 0;
    playerName = "Player";

    document.getElementById("playerCurrentScore").textContent = 0;
    document.getElementById("compCurrentScore").textContent = 0;
    document.getElementById("playerTotalScore").textContent = 0;
    document.getElementById("compTotalScore").textContent = 0;
    document.querySelector('#player h2').textContent = 'Player';
    document.getElementById('user').value = '';

    resetIconSelection()
    resetDiceImages();
    hidePopup(); 

    startGameButton.disabled = false;
    rollButton.disabled = true;
    resetButton.disabled = true;
}

function resetIconSelection() {
    const characterRadios = document.querySelectorAll("#characterSelect input[type='radio']");
    characterRadios.forEach(function(radio) {
        radio.checked = false;
    });
}

function resetDiceImages() {
    const initialDiceImage = `images/dice-01.svg`;
    const initialIconImage = `images/toadIcon.jpg`;
    document.getElementById("playerDice1").src = initialDiceImage;
    document.getElementById("playerDice2").src = initialDiceImage;
    document.getElementById("compDice1").src = initialDiceImage;
    document.getElementById("playerIcon").src = initialIconImage;
    document.getElementById("computerIcon").src = initialIconImage;
}


resetButton.addEventListener("click", resetGame);

