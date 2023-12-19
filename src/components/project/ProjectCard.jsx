// react
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";

// css
import styles from "./ProjectCard.module.css";

function ProjectCard({ project, handleRemove }) {
  
  if (!project) {
    console.error('Dados do projeto inválidos:', project);
    return <div>Dados do projeto inválidos</div>; 
  }

  const { id, name, budget, category_id } = project;

  return (
    <div className={styles.project_card}>
      <h4>{name}</h4>
      <p>
        <span>Orcamento: </span>{" "}
        {Number(budget).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <p className={styles.category_text}>
        <span
          className={`${styles[category_id ? category_id.toString().toLowerCase() : 'default']}`}
        ></span>{" "}
        {category_id ? `Categoria ${category_id}` : 'Categoria não disponível'}
      </p>
      <div className={styles.project_card_actions}>
        <Link to={`/project/${id}`}>
          <BsPencil /> Editar
        </Link>
        <button onClick={() => handleRemove(id)}>
          <BsFillTrashFill /> Remover
        </button>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    budget: PropTypes.number,
    category_id: PropTypes.number,
    cost: PropTypes.number,
  }),
  handleRemove: PropTypes.func.isRequired,
};

export default ProjectCard;
