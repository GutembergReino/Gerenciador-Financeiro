import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";

import styles from "./ProjectForm.module.css";

export default function ProjectForm({ handleSubmit, projectData, btnText }) {
  const navigate = useNavigate(); 

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const [project, setProject] = useState(projectData || {
    name: "",
    budget: 0,
    category_id: "",
  });

  const submit = (e) => {
    e.preventDefault();
    if (project.id) {
      handleEditProject(project);
    } else {
      handleCreateProject(project);
    }
  };

  function handleChange(e) {
    setProject({ ...project, [e.target.name]: e.target.value });
  }

  function handleCategory(e) {
    setProject({
      ...project,
      category_id: e.target.value,
    });
  }

  const handleCreateProject = async (projectData) => {
    try {
      const response = await fetch('http://localhost:5000/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}, Response: ${JSON.stringify(errorResponse)}`);
      }

      const successResponse = await response.json();
      console.log('Projeto criado com sucesso:', successResponse);
      navigate("/projects", { state: { message: "projeto criado com sucesso"} });

    } catch (error) {
      console.error('Error creating project:', error.message);
    }
  };

  const handleEditProject = (editedProject) => {
    if (editedProject.id) {
      fetch(`http://localhost:5000/projects/${editedProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProject),
      })
        .then((resp) => resp.json())
        .then((data) => {
          handleSubmit(data);
          navigate("/projects", { state: { message: "Projeto editado com sucesso" } });
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do projeto"
        name="name"
        handleOnChange={handleChange}
        value={project.name || ""}
      />
      <Input
        type="number"
        text="Orçamento"
        name="budget"
        handleOnChange={handleChange}
        value={parseFloat(project.budget) || 0}
      />
      <Select
        name="category_id"
        text="Selecione categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category_id || ""}
      />
      <SubmitButton text={btnText} />
    </form>
  );
}

ProjectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  projectData: PropTypes.object,
  btnText: PropTypes.string.isRequired,
};
