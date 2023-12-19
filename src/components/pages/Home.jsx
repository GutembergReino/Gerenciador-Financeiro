// components
import LinkButton from "../form/LinkButton";
import Navbar from "../layout/Navbar";

// css
import styles from "./Home.module.css";

export default function Home() {
  return (
    <div>
      <Navbar />
    <section className={styles.home_container}><br />
      <h1>Finan<span>digio</span></h1>
      <p>Seja bem-vindo ao nosso Gerenciador financeiro!</p>
      <LinkButton to="/newproject" text="Novo projeto" />
    </section>
    </div>
  );
}
