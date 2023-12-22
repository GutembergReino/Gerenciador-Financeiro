import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { BsPencil, BsFillTrashFill } from "react-icons/bs";
import Loading from "../layout/Loader";

import styles from "./ProjectCard.module.css";

function ProjectCard({ project, handleRemove }) {
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (project && project.category_id) {
      fetch(`http://localhost:5000/categories/${project.category_id}`)
        .then((response) => response.json())
        .then((data) => {
          setCategoryName(data.name);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Erro ao obter o nome da categoria:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [project]);

  if (!project) {
    console.error("Dados do projeto inválidos:", project);
    return <div>Dados do projeto inválidos</div>;
  }

  const { id, name, budget } = project;

  return (
    <div className={styles.project_card}>
      <h4>{name}</h4>
      <p>
        <span>Orcamento: </span>{" "}
        {parseFloat(budget).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
      <p className={styles.category_text}>
        <span
          className={`${styles[categoryName
            ? categoryName.toLowerCase()
            : "default"]}`}
        ></span>{" "}
        {categoryName
          ? `Categoria ${categoryName}`
          : "Categoria não disponível"}
        {loading && <Loading />}
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
