import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryForm from "../categories/CategoryForm";
import styles from "./NewCategory.module.css";
import Navbar from "../Navbar";
import Message from "../layout/Message";

export default function NewCategory() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
        setMessage("Categoria criada com sucesso!");
        navigate('/categories', { state: { message: 'categoria criada com sucesso' } });
      })
      .catch((err) => {
        console.error(err);
        setMessage("Erro ao criar categoria.");
      });
  }

  return (
    <div>
      <Navbar />
      <div className={styles.new}>
        <div className={styles.newcategory_container}>
          <h1>Nova Categoria</h1>
          <p>Crie suas categorias para organização</p>
          {message && <Message msg={message} type="success" />}
          <CategoryForm handleSubmit={createCategory} btnText="Criar categoria" />
        </div>
      </div>
    </div>
  );
}
