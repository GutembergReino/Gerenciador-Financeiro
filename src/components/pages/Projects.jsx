import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "../layout/Container";
import Message from "../layout/Message";
import LinkButton from "../form/LinkButton";
import ProjectCard from "../project/ProjectCard";
import Loader from "../layout/Loader";

import styles from "./Projects.module.css";
import Navbar from "../layout/Navbar";

export default function Projects() {
  const location = useLocation();
  const navigate = useNavigate();

  let message = "";
  if (location.state) {
    message = location.state.message;
  }

  const [deleteMessage, setDeleteMessage] = useState("");
  const [createMessage, setCreateMessage] = useState("");

  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProjects(data);
          setRemoveLoading(true);
        })
        .catch((err) => console.error(err));
    }, 300);
  }, [createMessage]);

  useEffect(() => {
    if (message === "Projeto criado com sucesso") {
      handleProjectCreationSuccess();
      navigate("/", { state: undefined });
    }
  }, [message, navigate]);

  return (
    <div>
      <Navbar />
      <div className={styles.project_container}>
        <div className={styles.title_container}>
          <h1>Orçamentos</h1>
          <LinkButton to="/newproject" text="Novo Projeto" />
        </div>
        {message && <Message msg={message} type="success" />}
        {deleteMessage && <Message msg={deleteMessage} type="success" />}
        {createMessage && <Message msg={createMessage} type="success" />}
        <Container customClass="start">
          {projects.length > 0 &&
            projects.map((project) => (
              <ProjectCard
                project={project}
                handleRemove={removeProject}
                key={project.id}
              />
            ))}
          {!removeLoading && <Loader />}
          {removeLoading && projects.length === 0 && (
            <Message msg={"Não há projetos cadastrados"} type="error" />
          )}
        </Container>
      </div>
    </div>
  );

  function removeProject(id) {
    setDeleteMessage("");
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProjects(projects.filter((project) => project.id !== id));
        setDeleteMessage("Projeto removido com sucesso");
      })
      .catch((err) => console.error(err));
  }

  function handleProjectCreationSuccess() {
    setCreateMessage("Projeto criado com sucesso");
    setTimeout(() => {
      setCreateMessage("");
    }, 5000);
  }
}
