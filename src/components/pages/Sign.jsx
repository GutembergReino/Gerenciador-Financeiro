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
    password: '',
    confirmPassword: '',
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
        const response = await axios.get(`http://localhost:5000/users?email=${formData.email}&password=${formData.password}`);
        if (response.status === 200) {
          console.log('Login bem-sucedido');
          navigate('/home');
        } else {
          console.log('Login falhou');
          console.log(response);
        }
      } else if (formType === 'signup') {
        const response = await axios.post('http://localhost:5000/signup', formData);

        if (response.status === 201) {
          console.log('Registro bem-sucedido');
          navigate('/home');
        } else {
          console.log('Registro falhou');
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
              name="password"
              placeholder="Senha"
              value={formData.password}
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
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon icon={faLock} className={styles.iPassword} />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar senha"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
            />
            <FontAwesomeIcon icon={faLock} className={styles.iPassword} /><br /><br />
            <button type="submit">Criar conta</button>
          </form>
        )}
      </div>
    </>
  );
}

export default Sign;
