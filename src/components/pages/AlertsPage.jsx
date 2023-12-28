import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import Navbar from '../layout/Navbar';
import styles from './AlertsPage.module.css';

const AlertsPage = () => {
  const [services, setServices] = useState([]);
  const [paidServices, setPaidServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/services')
      .then(response => setServices(response.data))
      .catch(error => console.error('Erro ao obter serviços:', error));
  }, []);

  const getStatus = (paymentDate) => {
    const currentDate = new Date();
    const paymentDueDate = new Date(paymentDate);
  
    if (paymentDueDate < currentDate) {
      return 'atrasado';
    } else {
      return 'aguardando pagamento';
    }
  };

  const handlePayment = (serviceId) => {
    axios.put(`http://localhost:5000/services/${serviceId}/pay`)
      .then(response => {
        console.log('Pagamento bem-sucedido:', response.data);
        setPaidServices([...paidServices, response.data]);
        setServices(services.filter(service => service.id !== serviceId));
      })
      .catch(error => console.error('Erro ao pagar serviço:', error));
  };

  const unpaidServices = services.filter(service => getStatus(service.paymentDate) !== 'pago');

  return (
    <div>
      <Navbar />
      <section className={styles.page_container}>
        <h1>Serviços</h1>
        <div className={styles.gridContainer}>
        {unpaidServices.map(service => (
          <div key={service.id} className={styles.gridItem}>
            <strong>Nome do Serviço:</strong> {service.name}<br />
            <strong>Custo:</strong> {service.cost}<br />
            <strong>Descrição:</strong> {service.description}<br />
            <strong>Data de Pagamento:</strong> {format(new Date(service.paymentDate), 'dd/MM/yyyy')}<br />
            {service.status !== 'pago' && (
              <>
                <strong>Status:</strong> {getStatus(service.paymentDate)}<br />
                <button onClick={() => handlePayment(service.id)}>Pagar</button>
              </>
            )}
          </div>
        ))}
        </div>
      </section>
    </div>
  );
};

export default AlertsPage;
