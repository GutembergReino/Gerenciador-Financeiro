import React from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../categories/CategoryForm";
import styles from "./NewCategory.module.css";
import Navbar from "../layout/Navbar";

export default function NewCategory() {
  const navigate = useNavigate();

  function createCategory(category) {
    fetch("http://localhost:5000/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    })
      .then((resp) => resp.json())
      .then((data) => {
        navigate("/categories", {
          state: { message: "Categoria criada com sucesso!" },
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <Navbar />
      <div className={styles.new}>
        <div className={styles.newcategory_container}>
          <h1>Nova Categoria</h1>
          <p>Crie suas categorias para organização</p>
          <CategoryForm handleSubmit={createCategory} btnText="Criar categoria" />
        </div>
      </div>
    </div>
  );
}
