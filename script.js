document.addEventListener("DOMContentLoaded", () => {
    const guessedLettersElement = document.querySelector(".guessed-letters");
    const guessButton = document.querySelector(".guess");
    const letterInput = document.querySelector(".letter");
    const wordInProgress = document.querySelector(".word-in-progress");
    const remainingGuessesElement = document.querySelector(".remaining span");
    const messageElement = document.querySelector(".message");
    const playAgainButton = document.querySelector(".play-again");
    const definitionButton = document.querySelector(".definition");
    const definitionText = document.querySelector(".definition-text");

    let word = "";
    let guessedLetters = [];
    let remainingGuesses = 8;

    // Fetch a random word from the API
    const fetchRandomWord = async () => {
        const url = 'https://random-word-api.herokuapp.com/word?lang=en';
        try {
            const response = await fetch(url);
            const [randomWord] = await response.json();
            word = randomWord.toLowerCase();
            displayWordInProgress();
        } catch (error) {
            console.error('Error fetching random word:', error);
            messageElement.innerText = "Failed to load the word. Please try again.";
        }
    };

    // Display placeholders for the word
    const displayWordInProgress = () => {
        const placeholders = word.split("").map(() => "●").join("");
        wordInProgress.innerText = placeholders;
    };

    // Validate input
    const validateInput = (input) => {
        const acceptedLetter = /^[a-zA-Z]$/;
        if (input.length === 0) {
            messageElement.innerText = "Please enter a letter.";
        } else if (input.length > 1) {
            messageElement.innerText = "Please enter a single letter.";
        } else if (!input.match(acceptedLetter)) {
            messageElement.innerText = "Please enter a letter from A to Z.";
        } else {
            return input.toLowerCase();
        }
    };

    // Update guessed letters
    const updateGuessedLetters = (letter) => {
        if (!guessedLetters.includes(letter)) {
            guessedLetters.push(letter);
            guessedLettersElement.innerHTML = "";
            guessedLetters.forEach((letter) => {
                const li = document.createElement("li");
                li.innerText = letter.toUpperCase();
                guessedLettersElement.append(li);
            });
        }
    };

    // Update word in progress
    const updateWordInProgress = () => {
        const wordArray = word.split("");
        const revealWord = wordArray
            .map((letter) => (guessedLetters.includes(letter) ? letter.toUpperCase() : "●"))
            .join("");
        wordInProgress.innerText = revealWord;
        checkIfPlayerWon(revealWord);
    };

    // Check if player won
    const checkIfPlayerWon = (wordInProgress) => {
        if (wordInProgress === word.toUpperCase()) {
            messageElement.classList.add("win");
            messageElement.innerHTML = `<p class="highlight">You guessed the word! Congrats!</p>`;
            guessButton.classList.add("hide");
            definitionButton.classList.remove("hide");
            playAgainButton.classList.remove("hide");
        }
    };

    // Fetch definition
    const fetchDefinition = async () => {
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
        try {
            const response = await fetch(url);
            const [data] = await response.json();
            const definition = data.meanings[0].definitions[0].definition;
            definitionText.innerText = definition;
            definitionText.classList.remove("hide");
        } catch (error) {
            definitionText.innerText = "Definition not found.";
            definitionText.classList.remove("hide");
        }
    };

    // Handle guess button click
    guessButton.addEventListener("click", (e) => {
        e.preventDefault();
        const guess = validateInput(letterInput.value);
        if (guess && !guessedLetters.includes(guess)) {
            updateGuessedLetters(guess);
            updateWordInProgress();
            updateRemainingGuesses(guess);
        }
        letterInput.value = "";
    });

    // Update remaining guesses
    const updateRemainingGuesses = (guess) => {
        if (!word.includes(guess)) {
            remainingGuesses--;
            remainingGuessesElement.innerText = remainingGuesses;
            messageElement.innerText = `The word does not contain ${guess.toUpperCase()}.`;
        } else {
            messageElement.innerText = `Good guess! The word contains ${guess.toUpperCase()}.`;
        }
        if (remainingGuesses === 0) {
            messageElement.innerHTML = `<p class="highlight">Game over! The word was <span class="underline">${word.toUpperCase()}</span>.</p>`;
            guessButton.classList.add("hide");
            definitionButton.classList.remove("hide");
            playAgainButton.classList.remove("hide");
        }
    };

    // Handle play again button click
    playAgainButton.addEventListener("click", () => {
        resetGame();
    });

    // Handle definition button click
    definitionButton.addEventListener("click", () => {
        fetchDefinition();
    });

    // Reset the game
    const resetGame = () => {
        messageElement.innerText = "";
        guessedLettersElement.innerHTML = "";
        guessedLetters = [];
        remainingGuesses = 8;
        remainingGuessesElement.innerText = remainingGuesses;
        guessButton.classList.remove("hide");
        playAgainButton.classList.add("hide");
        definitionButton.classList.add("hide");
        definitionText.classList.add("hide");
        fetchRandomWord();
    };

    // Start the game
    fetchRandomWord();
});
