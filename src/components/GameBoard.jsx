import { useState, useEffect } from "react";
import BuildDeck from "./Symbols";
import { Link } from "react-router-dom";
import styles from "../GameBoard.module.css";
import { motion as animation } from "framer-motion";
import cardFlipSound from "../assets/card-sound.mp3";
import correctMatch from "../assets/correct.mp3";
const correctMatchSound = new Audio(correctMatch);
const cardAudio = new Audio(cardFlipSound);

export default function MemoryGame() {
  // cards: the main deck state (array of card objects)
  const [cards, setCards] = useState([]);

  // indices of selected cards (null when not selected)
  const [firstIndex, setFirstIndex] = useState(null);
  const [secondIndex, setSecondIndex] = useState(null);

  // used to prevent clicking while checking a pair
  const [lockBoard, setLockBoard] = useState(false);

  // simple stats for feedback
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  // initialize the deck on first mount
  useEffect(() => {
    setCards(BuildDeck());
  }, []);

  // When secondIndex changes from null -> number, we check for match
  useEffect(() => {
    if (firstIndex === null || secondIndex === null) return;

    // prevent further clicks until we decide
    setLockBoard(true);

    // increment moves (we picked two cards)
    setMoves((m) => m + 1);

    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];

    // If values match, mark them matched and keep them flipped
    if (firstCard.value === secondCard.value) {
      setCards((prev) =>
        prev.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        )
      );

      setMatches((c) => c + 1);
      correctMatchSound.currentTime = 0;
      correctMatchSound.play();
      // reset selections and unlock immediately
      setFirstIndex(null);
      setSecondIndex(null);
      setLockBoard(false);
    } else {
      // Not a match: wait a little so player sees the second card, then flip back
      const timeout = setTimeout(() => {
        setCards((prev) =>
          prev.map((card) =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          )
        );
        cardAudio.currentTime = 0;
        cardAudio.play();
        setFirstIndex(null);
        setSecondIndex(null);
        setLockBoard(false);
      }, 700); // 700ms is a reasonable reveal time

      // cleanup in case component unmounts
      return () => clearTimeout(timeout);
    }
  }, [secondIndex]);

  // click handler for a card at position `index`
  function handleCardClick(index) {
    if (lockBoard) return; // ignore if we're checking a previous pair

    const clicked = cards[index];
    if (!clicked || clicked.isFlipped || clicked.isMatched) return; // ignore invalid clicks

    // flip the card we clicked
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );

    cardAudio.currentTime = 0;
    cardAudio.play();

    // If this is the first pick, store it. Otherwise store as second pick.
    if (firstIndex === null) {
      setFirstIndex(index);
    } else if (secondIndex === null) {
      // guard: clicking the same card twice
      if (index === firstIndex) return;
      setSecondIndex(index);
    }
  }

  function handleRestart() {
    cardAudio.currentTime = 0;
    cardAudio.play();
    setCards(BuildDeck());
    setFirstIndex(null);
    setSecondIndex(null);
    setLockBoard(false);
    setMoves(0);
    setMatches(0);
  }

  // simple visual helpers
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 100px)",
    gap: 12,
    justifyContent: "center",
  };

  const cardStyle = (card) => ({
    width: 100,
    height: 140,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 40,
    cursor: card.isMatched ? "default" : "pointer",
    borderRadius: 8,
    border: "none",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    userSelect: "none",
    background: card.isFlipped || card.isMatched ? "#fff" : "#2B1B14",
    color: card.isFlipped || card.isMatched ? "#111" : "#fff",
    transition: "all .4s ease",
  });

  return (
    <div
      style={{
        height: "100vh",
        padding: 24,
        fontFamily: "system-ui, Arial",
        textAlign: "center",
        background: "#FAF3E0",
      }}
      className={styles.page}
    >
      <h2 className={styles.title}>Memory Match Game</h2>
      <div className={styles.container}>
        <div style={{ marginBottom: 12 }}>
          <button onClick={handleRestart} className={styles.restartBtn}>
            Restart
          </button>
          <span
            style={{ marginRight: 12, color: "#2B1B14", fontWeight: "500" }}
          >
            Moves: <i>{moves}</i>
          </span>
          <span style={{ color: "#2B1B14", fontWeight: "500" }}>
            Matches:{" "}
            <i>
              {matches} / {cards.length / 2}
            </i>
          </span>
        </div>

        <div style={gridStyle} className={styles.cardsBoard}>
          {cards.map((card, index) => (
            <div
              key={card.id}
              style={{
                perspective: 800,
                userSelect: "none",
              }}
            >
              <animation.button
                aria-label="switch"
                onClick={() => handleCardClick(index)}
                style={cardStyle(card)}
                whileTap={{ scale: 0.9 }}
              >
                <animation.div
                  style={{
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    position: "relative",
                    width: "120%",
                    height: "100%",
                  }}
                  animate={{
                    rotateY: card.isFlipped || card.isMatched ? 180 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {/* front face */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      borderRadius: 8,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: "#2B1B14",
                      color: "#fff",
                    }}
                  >
                    ❓
                  </div>
                  {/* back face */}
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 40,
                      borderRadius: 8,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      background: "#2B1B14",
                      color: "#fff",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {card.value}
                  </div>
                </animation.div>
              </animation.button>
            </div>
          ))}
        </div>

        <div>
          <p style={{ marginTop: 16, color: "#555" }}>
            Tip: try to memorize positions and match all pairs.
          </p>
          <Link to="/">
            <button className={styles.homeBtn}>Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
