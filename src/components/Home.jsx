import { Link } from "react-router-dom";
import styles from "../Home.module.css";

function DesignTitle({ title }) {
  const colors = ["#ff900a"];

  return (
    <h1 className={styles.title}>
      {title.split("").map((char, index) => (
        <span
          key={index}
          style={{ color: colors[index % colors.length], margin: "0 8px" }}
        >
          {char}
        </span>
      ))}
    </h1>
  );
}

export default function HomePage() {
  return (
    <div className={styles.home}>
      <div className={styles.title}>
        <span className={styles.card}>card</span>

        <span className={styles.memory}>Memory</span>
        <span className={styles.match}>Match</span>
      </div>
      <Link to="/game">
        <button className={styles.playBtn}>
          {<i className="fa-solid fa-play"></i>}
        </button>
      </Link>
    </div>
  );
}
