import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";
import Message from "../layout/Message"; 
import styles from "../project/ProjectForm.module.css";

export default function ServiceForm({ handleSubmit, projectData, btnText }) {
  const [service, setService] = useState({
    name: "",
    cost: "",
    description: "",
    paymentDate: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const submit = async (event) => {
    event.preventDefault();

    const newCost =
      parseFloat(projectData.cost || 0) + parseFloat(service.cost || 0);

    if (newCost > parseFloat(projectData.budget || 0)) {
      setMessage(
        "A soma dos custos dos serviços não pode ser maior que o orçamento do projeto"
      );
      setMessageType("error");
      setService((prevService) => ({
        ...prevService,
        name: "",
        cost: "",
        description: "",
        paymentDate: "",
      }));
      return;
    }

    try {
      console.log("Dados enviados para criar serviço:", service);

      const response = await axios.post(
        `http://localhost:5000/projects/${projectData.id}/services`,
        service
      );
      console.log("Resposta do backend:", response.data);

      setService((prevService) => ({
        ...prevService,
        name: "",
        cost: "",
        description: "",
        paymentDate: "",
      }));

      setMessage("Serviço criado com sucesso!");
      setMessageType("success");

      handleSubmit(projectData);
    } catch (error) {
      console.error(
        "Erro ao adicionar serviço:",
        error.response?.data || error.message
      );
      setMessage(
      );
      setMessageType("error");

      setService((prevService) => ({
        ...prevService,
        name: "",
        cost: "",
        description: "",
        paymentDate: "",
      }));
    }
  };

  const handleChange = (event) => {
    setService({ ...service, [event.target.name]: event.target.value });
  };

  return (
    <div>
      {message && <Message type={messageType} msg={message} />}
      <form onSubmit={submit} className={styles.form}>
        <Input
          type="text"
          text="Nome do serviço"
          name="name"
          handleOnChange={handleChange}
          value={service.name}
          required
        />
        <Input
          type="number"
          text="Custo do serviço"
          name="cost"
          handleOnChange={handleChange}
          value={service.cost}
          required
        />
        <Input
          type="text"
          text="Descrição do serviço"
          name="description"
          handleOnChange={handleChange}
          value={service.description}
        />
        <Input
          type="date"
          text="Data de Pagamento"
          name="paymentDate"
          handleOnChange={handleChange}
          value={service.paymentDate}
          required
        />
        <SubmitButton text={btnText} />
        <br />
      </form>
    </div>
  );
}

ServiceForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  projectData: PropTypes.object.isRequired,
  btnText: PropTypes.string,
};
