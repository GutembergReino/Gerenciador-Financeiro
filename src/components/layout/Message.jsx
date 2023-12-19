// react
import { useState, useEffect } from "react";

// css
import styles from "./Message.module.css";

export default function Message({ type, msg }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!msg) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const messageTimer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(messageTimer);
  }, [msg]);

  return (
    <>
      {visible && (
        <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
      )}
    </>
  );
}
