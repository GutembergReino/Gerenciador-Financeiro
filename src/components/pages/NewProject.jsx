import { useNavigate } from "react-router-dom";

import ProjectForm from "../project/ProjectForm";

import styles from "./NewProject.module.css";

import Navbar from "../Navbar";

export default function NewProject() {
  const navigate = useNavigate();

  function createProject(project) {

    project.services = [];
    project.cost = 0.0;

    fetch("http://localhost:5000/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        navigate("/projects", {
          state: { message: "Projeto criado com sucesso!" },
        });
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <Navbar />
      <div className={styles.new}>
      <div className={styles.newproject_container}>
        <h1>Novo Orçamento</h1>
        <p>Crie seus orçamentos para depois adicionar seus serviços</p>
        <ProjectForm handleSubmit={createProject} btnText="Criar projeto" />
      </div>
     
      </div>
    </div>
  );
}
