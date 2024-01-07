import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import LinkButton from "../form/LinkButton";
import Navbar from "../layout/Navbar";
import styles from "./Home.module.css";
import Message from "../layout/Message";

export default function Home() {
  const location = useLocation();
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (location.state && location.state.message) {
      setShowMessage(true);

      const messageTimer = setTimeout(() => {
        setShowMessage(false);
      }, 3000);

      return () => clearTimeout(messageTimer);
    }
  }, [location.state]);

  return (
    <div>
      <Navbar />
        {showMessage && (
          <Message type="success" msg={location.state.message} />
        )}
      <section className={styles.home_container}>
        <h1>Finan<span>digio</span></h1>
        <p>Seja bem-vindo ao nosso Gerenciador financeiro!</p>
        <LinkButton to="/newproject" text="Novo projeto" />
      </section>
    </div>
  );
}
