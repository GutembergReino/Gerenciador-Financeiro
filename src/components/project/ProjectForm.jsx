import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import Input from "../form/Input";
import Select from "../form/Select";
import SubmitButton from "../form/SubmitButton";

import styles from "./ProjectForm.module.css";

export default function ProjectForm({ handleSubmit, projectData, btnText }) {
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
    budget: "",
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
      category: {
        id: e.target.options[e.target.selectedIndex].id,
        name: e.target.options[e.target.selectedIndex].text,
      },
    });
  }

  const handleCreateProject = (newProject) => {
    fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProject),
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error(`HTTP error! Status: ${resp.status}, Response: ${JSON.stringify(resp)}`);
        }
        return resp.json();
      })
      .then((data) => {
        handleSubmit(data);
      })
      .catch((err) => console.error("Error creating project:", err.message));
  };
  
  const handleEditProject = (editedProject) => {
    fetch(`http://localhost:5000/projects/${editedProject.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedProject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        handleSubmit(data);
      })
      .catch((err) => console.error(err));
  };

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do projeto"
        name="name"
        handleOnChange={handleChange}
        value={project.name ? project.name : ""}
      />
      <Input
        type="number"
        text="Orçamento"
        name="budget"
        handleOnChange={handleChange}
        value={project.budget ? project.budget : ""}
      />
      <Select
        name="category_id"
        text="Selecione categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category ? project.category.name : ""}
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
ProjectForm.defaultProps = {};
