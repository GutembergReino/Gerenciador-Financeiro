import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import Message from "../layout/Message"; 
import styles from "./Categories.module.css";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [removeMessage, setRemoveMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/categories")
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRemoveCategory = async (categoryId) => {
    try {
      const response = await fetch(`http://localhost:5000/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${JSON.stringify(errorResponse)}`);
      }
      const updatedCategories = categories.filter((category) => category.id !== categoryId);
      setCategories(updatedCategories);
      setRemoveMessage("Categoria removida com sucesso!");
    } catch (error) {
      console.error('Error removing category:', error.message);
      setRemoveMessage("Erro ao remover categoria.");
    }
  };

  return (
    <div>
      <Navbar />
          <Message type={removeMessage.includes("sucesso") ? "success" : "error"} msg={removeMessage} />
      <div className={styles.container}>
        <h1>Categorias</h1>
        <div className={styles.grid}>
          {categories.map((category) => (
            <div key={category.id} className={styles.item}>
              <p>{category.name}</p>
              <button onClick={() => handleRemoveCategory(category.id)}>Remover</button>
            </div>
          ))}
        </div>
        <Link to="/newcategories" className={styles.link}>
          Criar Nova Categoria
        </Link>
      </div>
    </div>
  );
}
