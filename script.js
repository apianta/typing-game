const quotes = [
  "The unexamined life is not worth living.",
  "There is no escape. We pay for the violence of our ancestors.",
  'When you have eliminated the impossible, whatever remains, however improbable, must be the truth.',
  'There is nothing more deceptive than an obvious fact.',
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.',
  'What one man can invent another can discover.',
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
  'A book must be the axe for the frozen sea within us.',
  'To study the self is to forget the self.',
  'Until you make the unconscious conscious, it will direct your life and you will call it fate.',
  'I must not fear. Fear is the mind-killer.',
];
// store the list of words and the index of the word the player is currently typing
let words = [];
let wordIndex = 0;
// starting time
let startTime = Date.now();
// game started flag
let gameStarted = false;
// page elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');

// Start and track
// end of script.js
document.getElementById('start').addEventListener('click', () => {
  gameStarted = true;
  // Get a quote
  const quoteIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[quoteIndex];
  // Put the quote into an array of words
  words = quote.split(' ');
  // Reset the word index for tracking
  wordIndex = 0;

  //  UI updates
  //  Create an array of span elements so we can set a class
  const spanWords = words.map(function (word) {
    return `<span>${word}</span>`;
  });
  //  Convert into string and set as innerHTML on quote display
  quoteElement.innerHTML = spanWords.join(' ');
  //  Highlight the first word
  quoteElement.children[0].className = 'highlight';
  //  Clear any prior messages
  messageElement.innerText = '';

  //  Setup the textbox
  //  Clear the textbox
  typedValueElement.value = '';
  //  Set focus
  typedValueElement.focus();
  //  Set the event handler
  typedValueElement.addEventListener('input', onInput);
  typedValueElement.disabled = false;

  //  Start the timer
  startTime = new Date().getTime();
});

// Allow Enter key to trigger the Start buttom when input is disabled
document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && !gameStarted) {
    document.getElementById('start').click();
    typedValueElement.focus();
  }
});

// Allow Enter key to close modal when it's open
document.addEventListener('keydown', (event) => {
  const modal = document.getElementById('modal');
  if (event.key === 'Enter' && !modal.classList.contains('hidden')) {
    document.getElementById('close-modal').click();
  }
});

//    Add typing logic
function onInput(event) {
  // Get the current word
  const currentWord = words[wordIndex];

  // Get the current value
  const rawValue = typedValueElement.value;
  const typedValue = rawValue.trim();

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    // End of sentence
    // Display success
    const elapsedTime = new Date().getTime() - startTime;
    const message = `${elapsedTime / 1000} seconds!`;

    messageElement.innerText = message;
    typedValueElement.removeEventListener('input', onInput);
    typedValueElement.disabled = true;

    // show modal dialog
    const modalMessage = document.getElementById('modal-message');
    const modal = document.getElementById('modal');
    modalMessage.innerText = message;
    modal.classList.remove('hidden');
    const seconds = elapsedTime / 1000;
    const prevBest = parseFloat(localStorage.getItem('highScore'));
    if (!prevBest || seconds < prevBest) {
      localStorage.setItem('highScore', seconds);
    }
    updateHighScoreDisplay();
  } else if (rawValue.endsWith(' ') && typedValue === currentWord) {
    // End of word
    // Clear the typedValueElement for the new word
    typedValueElement.value = '';
    // Move to the next word
    wordIndex++;
    // reset the class name for all elements in quote
    for (const wordElement of quoteElement.children) {
      wordElement.className = '';
    }
    // highlight the new word
    quoteElement.children[wordIndex].className = 'highlight';
  } else if (currentWord.startsWith(typedValue)) {
    // currently correct
    // highlight the next word
    typedValueElement.className = '';
  } else {
    // error state
    typedValueElement.className = 'error';
  }
}

document.getElementById('close-modal').addEventListener('click', () => {
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  typedValueElement.value = '';
  gameStarted = false;
});

// High score display
function updateHighScoreDisplay() {
  const highScore = localStorage.getItem('highScore');
  const highScoreElement = document.getElementById('high-score');
  if (highScore) {
    highScoreElement.innerText = `Best time: ${parseFloat(highScore).toFixed(
      2
    )} seconds`;
  } else {
    highScoreElement.innerText = `Best time: --`;
  }
}

updateHighScoreDisplay();
