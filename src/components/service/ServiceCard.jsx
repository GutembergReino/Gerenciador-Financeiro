import PropTypes from "prop-types";
import styles from "../project/ProjectCard.module.css";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { format } from 'date-fns';

export default function ServiceCard({
  id,
  name,
  cost,
  description,
  paymentDate,
  status,
  handleRemove,
}) {
  const remove = (e) => {
    e.preventDefault();
    handleRemove(id, cost);
  };

  const formattedPaymentDate = paymentDate
    ? format(new Date(paymentDate), 'dd/MM/yyyy')
    : 'Data não disponível';

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
      <p>
        <span>Data de Pagamento:</span> {formattedPaymentDate}
      </p>
      <p>
        <span>Status:</span> {status}
      </p>
      <div className={styles.project_card_actions}>
        <Link to={'/alertas'}>
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
  status: PropTypes.string,
  paymentDate: PropTypes.instanceOf(Date), 
  handleRemove: PropTypes.func.isRequired,
};

ServiceCard.defaultProps = {
  name: "Nome do serviço",
  cost: "Custo do serviço",
  description: "Descrição vazia",
  status: "indisponivel",
  paymentDate: null, 
};
