import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import bcryptjs from "bcryptjs";
import Message from "../layout/Message";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Sign() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.message === "login bem-sucedido") {
      setShowLoginMessage(true);
      setTimeout(() => {
        setShowLoginMessage(false);
      }, 3000);
    }
  }, [location.state]);

  const [formType, setFormType] = useState("signin");
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [showLoginMessage, setShowLoginMessage] = useState(false);

  const handleFormTypeChange = (type) => {
    setFormType(type);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setErrorMessage("");
      console.log("Dados enviados ao servidor:", formData);

      if (!isEmailValid(formData.email)) {
        setErrorMessage("Por favor, insira um formato de email válido.");
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
          setErrorMessage("");
        }, 3000);
        return;
      }

      if (formType === "signin") {
        const response = await axios.get("http://localhost:5000/users", {
          params: {
            email: formData.email,
            senha: formData.senha,
          },
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Resposta do servidor:", response.data);

        if (response.status === 200) {
          const userData = response.data;

          if (Array.isArray(userData) && userData.length > 0) {
            const user = userData[0];
            const passwordMatch = await bcryptjs.compare(
              formData.senha,
              user.senha
            );

            if (!passwordMatch) {
              setErrorMessage(
                "Email ou senha incorretos. Por favor, tente novamente."
              );
            } else {
              console.log("Login bem-sucedido");
              navigate("/home", { state: { message: "login bem-sucedido" } });
            }
          } else {
            navigate("/home", { state: { message: "login bem-sucedido" } });
          }
        } else {
          console.error("Erro durante a requisição:", response);
          setErrorMessage("Email ou senha incorreto (a).");
        }
      } else if (formType === "signup") {
        const response = await axios.post(
          "http://localhost:5000/users",
          {
            email: formData.email,
            senha: formData.senha,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Resposta do servidor para signup:", response.data);

        if (response.status === 201) {
          console.log("Novo usuário criado com sucesso");
          navigate("/home", {
            state: { message: "Conta criada com sucesso" },
          });
        } else {
          console.log("Novo usuário criado com sucesso");
          navigate("/home", {
            state: { message: "Conta criada com sucesso" },
          });
        }
      }
    } catch (error) {
      console.error("Erro durante a requisição:", error);
      setErrorMessage("Email ou senha incorreto(a).");
    } finally {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setErrorMessage("");
      }, 3000);
    }
  };

  const formSigninStyle = formType === "signin" ? { left: "25px" } : { left: "-450px" };
  const formSignupStyle = formType === "signin" ? { left: "450px" } : { left: "25px" };
  const btnColorStyle = formType === "signin" ? { left: "0px" } : { left: "110px" };

  return (
    <>
      <div className="container">
        {showAlert && <Message type="error" msg={errorMessage} />}
        {showLoginMessage && <Message type="success" msg="Login bem-sucedido" />}
        <div className="d-flex justify-content-between mb-3">
          <button
            className={`btn ${formType === "signin" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleFormTypeChange("signin")}
          >
            Entrar
          </button>
          <button
            className={`btn ${formType === "signup" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleFormTypeChange("signup")}
          >
            Criar conta
          </button>
        </div>
        <div className="row">
          <form className="col-md-6 offset-md-3" onSubmit={handleSubmit} style={formSigninStyle} id="signin">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="username"
              required
              className="form-control"
            />
            <FontAwesomeIcon icon={faEnvelope} />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
              className="form-control"
            />
            <FontAwesomeIcon icon={faLock} /><br /><br />
            <button type="submit" className="btn btn-primary">
              Entrar
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Sign;
