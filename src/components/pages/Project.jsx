import { v4 } from "uuid";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import Container from "../layout/Container";
import Loader from "../layout/Loader";
import Message from "../layout/Message";
import ProjectForm from "../project/ProjectForm";
import ServiceForm from "../service/ServiceForm";
import ServiceCard from "../service/ServiceCard";

import styles from "./Project.module.css";
import Navbar from "../layout/Navbar";

export default function Project() {
  const [message, setMessage] = useState();
  const [messageType, setMessageType] = useState();


  const { id } = useParams();
  const [project, setProject] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          setProject(data);
          setServices(data.services);
        })
        .catch((err) => console.error(err));
    }, 300);
  }, [id]);


  const [showProjectForm, setShowProjectForm] = useState(false);
  function toggleProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

 
  const [showServiceForm, setShowServiceForm] = useState(false);
  function toggleServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  function createService(project) {
    setMessage("");

    const lastService = project.services.at(-1);
    lastService.id = v4();

    const newCost = parseFloat(project.cost) + parseFloat(lastService.cost);

    if (newCost > parseFloat(project.budget)) {
      setMessage("Acima do orçamento, verifique o custo do serviço!");
      setMessageType("error");
      project.services.pop();
      return false;
    }

    project.cost = newCost;

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setShowServiceForm(false);
        setMessage("Serviço criado com sucesso!");
        setMessageType("success");
      })
      .catch((err) => console.error(err));
  }


  function removeService(id, cost) {
    setMessage("");

    const servicesUpdate = project.services.filter(
      (service) => service.id !== id
    );

    const projectUpdated = project;
    projectUpdated.services = servicesUpdate;
    projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost);

    fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectUpdated),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(projectUpdated);
        setServices(servicesUpdate);
        setMessageType("success");
        setMessage("Serviço deletado com sucesso!");
      })
      .catch((err) => console.error(err));
  }


  function editProject(project) {
    setMessage("");


    if (project.budget < project.cost) {
      setMessage("Orçamento insuficiente!");
      setMessageType("error");
      return false;
    }
    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((resp) => resp.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto atualizado com sucesso!");
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
        }, 3000);
      })
      .catch((err) => console.error(err));
  }

  return (
    <div>
      <Navbar />  
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message msg={message} type={messageType} />}
            <div className={styles.details_container}>
              <h1>Projeto: {project.name}</h1>
              <button onClick={toggleProjectForm} className={styles.btn}>
                {!showProjectForm ? "Editar projeto" : "Fechar"}
              </button>
              {!showProjectForm ? (
                // PROJECT DETAILS
                <div className={styles.project_info}>
                  <p>
                    <span>Categoria: </span>
                    {project.category.name}
                  </p>
                  <p>
                    <span>Valor: </span>
                    {Number(project.budget).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                  <p>
                    <span>Custos: </span>
                    {Number(project.cost).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              ) : (
                // PROJECT EDIT FORM
                <div className={styles.project_info}>
                  <ProjectForm
                    handleSubmit={editProject}
                    projectData={project}
                    btnText="Editar Projeto"
                  />
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicionar serviços:</h2>
              <button className={styles.btn} onClick={toggleServiceForm}>
                {!showServiceForm ? "Adicionar serviços" : "Fechar"}
              </button>
              <div className={styles.project_info}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    projectData={project}
                    btnText="Adicionar serviço"
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              {services.length > 0 &&
                services.map((service) => (
                  <ServiceCard
                    id={service.id}
                    name={service.name}
                    cost={service.cost}
                    description={service.description}
                    handleRemove={removeService}
                    key={service.id}
                  />
                ))}
              {services.length === 0 && (
                <p>Não há serviços cadastrados.</p>
              )}
            </Container>
          </Container>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}
