// Seeting Game Name
let gameName = "Guess who the player is";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Omar Zeyada`;

// Seeting Game Options
let numberOfTries = 7;
let numberOfLetters = 7;
let currentTry = 1;
let numberOfHints = 2;

// Manage Word
let wordToGuess = "";
let words = [
  "Mbappe ",
  "Neymar ",
  "Rhodri ",
  "Hakimi ",
  "Modric ",
  "Alonso ",
  "Zidane ",
  "Buffon ",
  "Haaland",
  "Muller ",
  "Ronaldo",
  "Messi  ",
  "Salah  ",
  "Pelé   ",
  "Saka   ",
  "Son    ",
  "vanDijk",
  "Kanté  ",
  "Maldini",
  "Cruyff ",
  "Iniesta",
  "Suárez ",
  "Rivaldo",
  "Carlos ",
  "Beckham",
  "Owen   ",
  "Shearer",
  "Vieira ",
  "Nesta  ",
  "Seedorf",
  "Cafu   ",
  "Rooney ",
  "Kaka   ",
  "Trika  ",
  "Benzema",
  "Ziyech ",
  "Brahim ",
  "Mahrez ",
  "Bale   ",
];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let messageArea = document.querySelector(".message")

// Manage Hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

document.querySelector(".try-again").onclick = function () {
  window.location.reload();
}

function generateInput() {

  const inputsContainer = document.querySelector(".inputs");

  // Create Main Try Div
  for (let i = 1; i <= numberOfTries; i++) {

    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) tryDiv.classList.add("disabled-inputs");

    // Create Inputs
    for (let j = 1; j <= numberOfLetters; j++) {

      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input)

    }

    inputsContainer.appendChild(tryDiv);

  }

inputsContainer.children[0].children[1].focus();

// Disable All Inputs Except First One
const inputsInDisableDiv = document.querySelectorAll(".disabled-inputs input");
inputsInDisableDiv.forEach((input) => (input.disabled = true));

const inputs = document.querySelectorAll("input");
inputs.forEach((input, index) => {
  // Convert Input To UpperCase
  input.addEventListener("input", function () {

    this.value = this.value.toUpperCase();
    
    const nextInput = inputs[index + 1];
    if(nextInput) nextInput.focus();

  });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) inputs[prevInput].focus();
      }
    });
  });
}

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

function handleGuesses() {
  let successGuess = true;
  for (let i = 1; i <= numberOfLetters; i++) {
    const inputField = document.querySelector(
      `#guess-${currentTry}-letter-${i}`
    );
    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      // Letter Is Correct And In
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      // Letter Is Correct And Not In Place
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  // Check If User Win Or Lose
  if (successGuess) {
    messageArea.innerHTML = `Your Win The Word Is <span>${wordToGuess}</span>`;
    if (numberOfHints === 2) {
      messageArea.innerHTML = `<p>Congratz You Did't Use Hints</p> `;
    }

    // Add Disabled Class On All Try Divs
    let allTries = document.querySelectorAll(".inputs > div");
    allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

    // Disabled Guess Button
    guessButton.disabled = true;
    getHintButton.disabled = true;


  } else {
    document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");

    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currentTryInputs.forEach((input) => (input.disabled = true));

    currentTry++;

    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));

    let el = document.querySelector(`.try-${currentTry}`);
    if (el) {
      document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
      el.children[1].focus();
    } else {
      guessButton.disabled = true;
      getHintButton.disabled = true;
      messageArea.innerHTML = `Your Lose The Word Is <span>${wordToGuess}</span>`;
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");

  const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== 1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackSpace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex =  Array.from(inputs).indexOf(document.activeElement);
    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

document.addEventListener("keydown", handleBackSpace);

window.onload = function () {

  generateInput();

};