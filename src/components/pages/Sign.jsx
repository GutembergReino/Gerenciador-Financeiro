import React, { useState } from 'react';
import styles from './Sign.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Sign() {
  const [formType, setFormType] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });

  const navigate = useNavigate();

  const handleFormTypeChange = type => {
    setFormType(type);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
  
    try {
      if (formType === 'signin') {
        const response = await axios.get('http://localhost:5000/users', {
          params: {
            email: formData.email,
            senha: formData.senha,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.status === 200) {
          const userData = response.data;
  
          if (Array.isArray(userData) && userData.length > 0) {
            alert('Email ou senha incorretos. Por favor, tente novamente.');
          } else {
            console.log('Login bem-sucedido');
            navigate('/home');
          }
        } else {
          console.log('Login falhou');
          console.log(response);
  
        }
      } else if (formType === 'signup') {
        const response = await axios.post('http://localhost:5000/users', formData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.status === 200) {
          console.log('Registro bem-sucedido');
          navigate('/home');
        } else {
          console.log('Registro falhou');
          alert('Email ou senha incorreta.');
          console.log(response);
        }
      }
    } catch (error) {
      console.error('Erro durante o processamento:', error);
      console.error(error.response);
    }
  };

  const formSigninStyle = formType === 'signin' ? { left: '25px' } : { left: '-450px' };
  const formSignupStyle = formType === 'signin' ? { left: '450px' } : { left: '25px' };
  const btnColorStyle = formType === 'signin' ? { left: '0px' } : { left: '110px' };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.buttonsForm}>
          <div className={styles.btnColor} style={btnColorStyle}></div>
          <button onClick={() => handleFormTypeChange('signin')}>Entrar</button>
          <button onClick={() => handleFormTypeChange('signup')}>Criar conta</button>
        </div>

        {formType === 'signin' && (
          <form onSubmit={handleSubmit} style={formSigninStyle} id="signin">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="username"
              required
            />
            <FontAwesomeIcon icon={faEnvelope} className={styles.iEmail} />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              autoComplete="current-password"
              required
            />
            <FontAwesomeIcon icon={faLock} className={styles.iPassword} /><br /><br />
            <button type="submit">Entrar</button>
          </form>
        )}

        {formType === 'signup' && (
          <form onSubmit={handleSubmit} style={formSignupStyle} id="signup">
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon icon={faEnvelope} className={styles.iEmail} />
            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon icon={faLock} className={styles.iPassword} />
            <button type="submit">Criar conta</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Sign;
