// Pick any set of symbols (emojis make good placeholders)
const EMOJIS = ["🍎", "🍌", "🍇", "🍒", "🥝", "🍍"];

// Fisher-Yates shuffle (returns a new shuffled array)
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a deck: duplicate the symbols and create card objects
function BuildDeck() {
  const doubled = [...EMOJIS, ...EMOJIS]; // pairs
  const shuffled = shuffle(doubled);
  return shuffled.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
}

export default BuildDeck;
