import React, { useState } from "react"; // Removed `useEffect` import
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";
import styles from "./CategoryForm.module.css";

export default function CategoryForm({ handleSubmit, categoryData, btnText }) {
  const navigate = useNavigate();

  const [category, setCategory] = useState(categoryData || {
    name: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (category.id) {
      handleEditCategory(category);
    } else {
      handleCreateCategory(category);
    }
  };

  function handleChange(e) {
    setCategory({ ...category, [e.target.name]: e.target.value });
  }

  const handleCreateCategory = async (categoryData) => {
    try {
      const response = await fetch('http://localhost:5000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${JSON.stringify(errorResponse)}`);
      }

      const successResponse = await response.json();
      console.log('Categoria criada com sucesso:', successResponse);

      navigate("/categories");

    } catch (error) {
      console.error('Error creating category:', error.message);
    }
  };

  const handleEditCategory = (editedCategory) => {
    if (editedCategory.id) {
      fetch(`http://localhost:5000/categories/${editedCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedCategory),
      })
        .then((resp) => resp.json())
        .then((data) => {
          handleSubmit(data);

          navigate("/categories");
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome da categoria"
        name="name"
        handleOnChange={handleChange}
        value={category.name || ""}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

CategoryForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  categoryData: PropTypes.object,
  btnText: PropTypes.string.isRequired,
};
