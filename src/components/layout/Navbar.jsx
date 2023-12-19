// react
import { Link } from "react-router-dom";

// components
import Container from "./Container";

// css
import styles from "./Navbar.module.css";
import logo from "../../img/costs_logo.png";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Container>
        <Link to="/Home">
          <img src={logo} className={styles.logo} alt="Finandigio" draggable={false} />
        </Link>
        <ul className={styles.list}>
          <li className={styles.item}>
            <Link to="/Home">Inicial</Link>
          </li>
          <li className={styles.item}>
            <Link to="/projects">Projetos</Link>
          </li>
          <li className={styles.item}>
            <Link to="/projects">Dashboard</Link>
          </li>
          <li className={styles.item}>
            <Link to="/alertas">Alertas</Link>
          </li>
          <li className={styles.itemS}>
            <Link to="/">Sair</Link>
          </li>
        </ul>
      </Container>
    </nav>
  );
}
