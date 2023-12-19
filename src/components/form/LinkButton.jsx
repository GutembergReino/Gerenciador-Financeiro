// react
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// css
import styles from "./LinkButton.module.css";

export default function LinkButton({ to, text }) {
  return (
    <Link to={to} className={styles.btn} draggable={false}>
      {text}
    </Link>
  );
}

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string,
};
LinkButton.defaultProps = {
  text: "Criar Projeto",
};
