import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";
import styles from "../project/ProjectForm.module.css";

export default function ServiceForm({ handleSubmit, projectData, btnText }) {
  const [service, setService] = useState({
    name: "",
    cost: "",
    description: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  
const submit = async (event) => {
  event.preventDefault();

  const newCost = parseFloat(projectData.cost || 0) + parseFloat(service.cost || 0);

  if (newCost > parseFloat(projectData.budget || 0)) {
    setMessage("Erro: Soma dos custos excede o orçamento do projeto");
    setMessageType("error");
    return;
  }

  try {
    console.log("Dados enviados para criar serviço:", service);

    const response = await axios.post(
      `http://localhost:5000/projects/${projectData.id}/services`,
      service
    );
    console.log("Resposta do backend:", response.data);

    setService({ name: "", cost: "", description: "" });

    setMessage("Serviço criado com sucesso!");
    setMessageType("success");

    handleSubmit(projectData);
  } catch (error) {
    console.error("Erro ao adicionar serviço:", error);
    setMessage("Erro ao adicionar serviço. Consulte o console para mais detalhes.");
    setMessageType("error");
  }
};

  const handleChange = (event) => {
    setService({ ...service, [event.target.name]: event.target.value });
  };

  return (
    <div>
      {message && <div className={messageType === "error" ? styles.error : styles.success}>{message}</div>}
      <form onSubmit={submit} className={styles.form}>
        <Input
          type="text"
          text="Nome do serviço"
          name="name"
          handleOnChange={handleChange}
          value={service.name}
        />
        <Input
          type="text"
          text="Custos do serviço"
          name="cost"
          handleOnChange={handleChange}
          value={service.cost}
        />
        <Input
          type="text"
          text="Descrição do serviço"
          name="description"
          handleOnChange={handleChange}
          value={service.description}
        />
        <SubmitButton text={btnText} />
      </form>
    </div>
  );
}

ServiceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  projectData: PropTypes.object.isRequired,
  btnText: PropTypes.string,
};

ServiceForm.defaultProps = {
  btnText: "Adicionar serviço",
};
