import PropTypes from "prop-types";
import styles from "../project/ProjectCard.module.css";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function ServiceCard({
  id,
  name,
  cost,
  description,
  handleRemove,
}) {
  const remove = (e) => {
    e.preventDefault();
    handleRemove(id, cost);
  };

  return (
    <div className={styles.project_card}>
      <h4>{name}</h4>
      <p>
        <span>Custo:</span>{" "}
        {Number(cost).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <p>{description}</p>
      <div className={styles.project_card_actions}>
        <Link to={'#'}>
          <BsPencil /> Pagamento
        </Link>
        <button onClick={remove}>
          <BsFillTrashFill /> Remover
        </button>
      </div>
    </div>
  );
}

ServiceCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  name: PropTypes.string,
  cost: PropTypes.string,
  description: PropTypes.string,
  handleRemove: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
  name: "Nome do serviço",
  cost: "Custo do serviço",
  description: "Descrição vazia",
};