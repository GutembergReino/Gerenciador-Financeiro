import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios"; // Importe o axios para fazer solicitações HTTP

import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";
import styles from "../project/ProjectForm.module.css";

export default function ServiceForm({ handleSubmit, projectData, btnText }) {
  const [service, setService] = useState({
    name: "",
    cost: "",
    description: "",
  });

  const submit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/services", service);
      console.log("Resposta do backend:", response.data);

      // Limpa os campos do formulário após a submissão
      setService({ name: "", cost: "", description: "" });

      // Chama a função handleSubmit passando o projeto atualizado, se necessário
      handleSubmit(projectData);
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error);
    }
  };

  const handleChange = (event) => {
    setService({ ...service, [event.target.name]: event.target.value });
  };

  return (
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
