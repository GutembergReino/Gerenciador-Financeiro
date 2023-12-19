// react
import { useState } from "react";
import PropTypes from "prop-types";

// components
import Input from "../form/Input";
import SubmitButton from "../form/SubmitButton";

// css
import styles from "../project/ProjectForm.module.css";

export default function ServiceForm({ handleSubmit, projectData, btnText }) {
  function submit(event) {
    event.preventDefault();
    projectData.services.push(service);
    handleSubmit(projectData);
  }

  const [service, setService] = useState({});
  function handleChange(event) {
    setService({ ...service, [event.target.name]: event.target.value });
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do serviço"
        name="name"
        handleOnChange={handleChange}
        value={service.name ? service.name : ""}
      />
      <Input
        type="text"
        text="Custos do serviço"
        name="cost"
        handleOnChange={handleChange}
        value={service.cost ? service.cost : ""}
      />
      <Input
        type="text"
        text="Descrição do serviço"
        name="description"
        handleOnChange={handleChange}
        value={service.description ? service.description : ""}
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
