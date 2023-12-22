const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(bodyParser.json());

const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'project_management',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
  } else {
    console.log('Conexão ao MySQL bem-sucedida');
  }
});

app.post('/projects', (req, res) => {
  const { name, budget, category_id, services } = req.body;

  if (!name || !budget || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const project = { name, budget, category_id };

  connection.query('INSERT INTO projects SET ?', project, (error, results) => {
    if (error) {
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ error: 'Erro ao criar projeto' });
    } else {
      const project_id = results.insertId;

      if (services && services.length > 0) {
        const serviceValues = services.map(service => [project_id, service.name, service.cost, service.description]);

        connection.query('INSERT INTO services (project_id, name, cost, description) VALUES ?', [serviceValues], (error, serviceResults) => {
          if (error) {
            console.error('Erro ao adicionar serviços:', error);
            res.status(500).json({ error: 'Erro ao adicionar serviços ao projeto' });
          } else {
            res.json({ message: 'Projeto e serviços criados com sucesso' });
          }
        });
      } else {
        res.json({ message: 'Projeto criado com sucesso' });
      }
    }
  });
});

// Adicionar a coluna project_id à tabela services
connection.query('ALTER TABLE services ADD COLUMN project_id INT, ADD CONSTRAINT fk_project_id FOREIGN KEY (project_id) REFERENCES projects(id)', (error, results) => {
  if (error) {
    console.error('Erro ao adicionar coluna project_id à tabela services:', error);
  } else {
    console.log('Coluna project_id adicionada com sucesso à tabela services');
  }
});

app.get('/projects/:id/services', (req, res) => {
  const project_id = req.params.id;

  connection.query('SELECT * FROM services WHERE project_id = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços do projeto:', error);
      res.status(500).json({ error: 'Erro ao obter serviços do projeto' });
    } else {
      res.json(results);
    }
  });
});

app.get('/projects', (req, res) => {
  connection.query('SELECT * FROM projects', (error, results) => {
    if (error) {
      console.error('Erro ao obter projetos:', error);
      res.status(500).json({ error: 'Erro ao obter projetos' });
    } else {
      res.json(results);
    }
  });
});

app.get('/projects/:id', (req, res) => {
  const project_id = req.params.id;

  connection.query('SELECT * FROM projects WHERE id = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter detalhes do projeto:', error);
      res.status(500).json({ error: 'Erro ao obter detalhes do projeto' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Projeto não encontrado' });
      }
    }
  });
});

app.get('/categories', (req, res) => {
  connection.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      console.error('Erro ao obter categorias:', error);
      res.status(500).json({ error: 'Erro ao obter categorias' });
    } else {
      res.json(results);
    }
  });
});

app.get('/services', (req, res) => {
  connection.query('SELECT * FROM services', (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços:', error);
      res.status(500).json({ error: 'Erro ao obter serviços' });
    } else {
      res.json(results);
    }
  });
});

app.post('/services', (req, res) => {
  const { name, cost, description } = req.body;

  if (!name || !cost || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes para o serviço' });
  }

  const service = { name, cost, description };

  connection.query('INSERT INTO services SET ?', service, (error, results) => {
    if (error) {
      console.error('Erro ao criar serviço:', error);
      res.status(500).json({ error: 'Erro ao criar serviço' });
    } else {
      res.json({ message: 'Serviço criado com sucesso' });
    }
  });
});

app.get('/users', (req, res) => {
  const { email, senha } = req.query;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      console.error('Erro ao realizar login:', error);
      return res.status(500).json({ error: 'Erro ao realizar login', details: error.message });
    }

    if (results.length > 0) {
      const user = results[0];
      // Agora, verifique a senha
      if (user.senha === senha) {
        res.json({ message: 'Login bem-sucedido' });
      } else {
        res.status(401).json({ error: 'Credenciais inválidas' });
      }
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.post('/users', (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const user = { email, senha };

  connection.query('INSERT INTO users SET ?', user, (error, results) => {
    if (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
    }

    res.json({ message: 'Usuário criado com sucesso' });
  });
});

app.delete('/projects/:id', (req, res) => {
  const project_id = req.params.id;

  connection.query('DELETE FROM services WHERE project_id = ?', [project_id], (error, deleteResults) => {
    if (error) {
      console.error('Erro ao excluir serviços associados ao projeto:', error);
      return res.status(500).json({ error: 'Erro ao excluir serviços associados ao projeto' });
    }

    connection.query('DELETE FROM projects WHERE id = ?', [project_id], (error, results) => {
      if (error) {
        console.error('Erro ao excluir projeto:', error);
        res.status(500).json({ error: 'Erro ao excluir projeto' });
      } else {
        res.json({ message: 'Projeto e serviços associados excluídos com sucesso' });
      }
    });
  });
});

app.put('/projects/:id', (req, res) => {
  const project_id = req.params.id;
  const { name, budget, category_id } = req.body;

  if (!name || !budget || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const updatedProject = { name, budget, category_id };

  connection.query('UPDATE projects SET ? WHERE id = ?', [updatedProject, project_id], (error, results) => {
    if (error) {
      console.error('Erro ao atualizar projeto:', error);
      res.status(500).json({ error: 'Erro ao atualizar projeto' });
    } else {
      res.json({ message: 'Projeto atualizado com sucesso' });
    }
  });
});

app.get('/categories/:id', (req, res) => {
  const categoryId = req.params.id;

  connection.query('SELECT * FROM categories WHERE id = ?', [categoryId], (error, results) => {
    if (error) {
      console.error('Erro ao obter detalhes da categoria:', error);
      res.status(500).json({ error: 'Erro ao obter detalhes da categoria' });
    } else {
      if (results.length > 0) {
        res.json(results[0]);
      } else {
        res.status(404).json({ error: 'Categoria não encontrada' });
      }
    }
  });
});

app.post('/services', (req, res) => {
  const { name, cost, description } = req.body;

  // Verifique se todos os campos necessários estão presentes
  if (!name || !cost || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  // Crie um objeto representando o serviço
  const service = { name, cost, description };

  // Execute a query para inserir o serviço no banco de dados
  connection.query('INSERT INTO services SET ?', service, (error, results) => {
    if (error) {
      console.error('Erro ao criar serviço:', error);
      return res.status(500).json({ error: 'Erro ao criar serviço' });
    }

    res.json({ message: 'Serviço criado com sucesso', id: results.insertId });
  });
});

app.get('/projects/:id', (req, res) => {
  const project_id = req.params.id;

  connection.query('SELECT * FROM services WHERE id_project = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços do projeto:', error);
      res.status(500).json({ error: 'Erro ao obter serviços do projeto' });
    } else {
      res.json(results);
    }
  });
});

app.get('/projects/:id/services', (req, res) => {
  const project_id = req.params.id;

  connection.query('SELECT * FROM services WHERE project_id = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços do projeto:', error);
      res.status(500).json({ error: 'Erro ao obter serviços do projeto' });
    } else {
      res.json(results);
    }
  });
});


app.post('/projects/:id/services', (req, res) => {
  const project_id = req.params.id;
  const { name, cost, description } = req.body;

  // Verifique se todos os campos necessários estão presentes
  if (!name || !cost || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  // Crie um objeto representando o serviço
  const service = { project_id: project_id, name, cost, description };

  // Execute a query para obter o orçamento do projeto
  connection.query('SELECT budget FROM projects WHERE id = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter o orçamento do projeto:', error);
      return res.status(500).json({ error: 'Erro ao obter o orçamento do projeto' });
    }

    const projectBudget = results[0].budget;
    
    // Execute a query para obter a soma dos custos dos serviços associados ao projeto
    connection.query('SELECT SUM(cost) AS totalCost FROM services WHERE project_id = ?', [project_id], (error, costResults) => {
      if (error) {
        console.error('Erro ao obter a soma dos custos dos serviços:', error);
        return res.status(500).json({ error: 'Erro ao obter a soma dos custos dos serviços' });
      }

      const totalCost = costResults[0].totalCost || 0;

      // Verifique se a soma dos custos dos serviços mais o novo custo excede o orçamento
      if (totalCost + Number(cost) > projectBudget) {
        return res.status(400).json({ error: 'A soma dos custos dos serviços não pode ser maior que o orçamento do projeto' });
      }

      // Execute a query para inserir o serviço no banco de dados
      connection.query('INSERT INTO services SET ?', service, (error, insertResults) => {
        if (error) {
          console.error('Erro ao criar serviço:', error);
          return res.status(500).json({ error: 'Erro ao criar serviço' });
        }

        const id = insertResults.insertId;
        console.log(`Serviço criado com sucesso. ID do serviço: ${id}`);

        // Exiba os detalhes do serviço salvo no banco de dados
        connection.query('SELECT * FROM services WHERE id = ?', [id], (error, serviceResults) => {
          if (error) {
            console.error('Erro ao obter detalhes do serviço:', error);
            return res.status(500).json({ error: 'Erro ao obter detalhes do serviço' });
          }

          console.log('Detalhes do serviço:', serviceResults[0]);

          res.json({ message: 'Serviço criado com sucesso', id });
        });
      });
    });
  });
});

app.delete('/projects/:project_id/services/:id', (req, res) => {
  const project_id = req.params.project_id;
  const id = req.params.id;

  // Execute a query para obter o orçamento do projeto
  connection.query('SELECT budget FROM projects WHERE id = ?', [project_id], (error, results) => {
    if (error) {
      console.error('Erro ao obter o orçamento do projeto:', error);
      return res.status(500).json({ error: 'Erro ao obter o orçamento do projeto' });
    }

    const projectBudget = results[0].budget;

    // Execute a query para obter a soma dos custos dos serviços associados ao projeto
    connection.query('SELECT SUM(cost) AS totalCost FROM services WHERE project_id = ?', [project_id], (error, costResults) => {
      if (error) {
        console.error('Erro ao obter a soma dos custos dos serviços:', error);
        return res.status(500).json({ error: 'Erro ao obter a soma dos custos dos serviços' });
      }

      const totalCost = costResults[0].totalCost || 0;

      // Execute a query para obter o custo do serviço a ser excluído
      connection.query('SELECT cost FROM services WHERE id = ?', [id], (error, serviceCostResults) => {
        if (error) {
          console.error('Erro ao obter o custo do serviço:', error);
          return res.status(500).json({ error: 'Erro ao obter o custo do serviço' });
        }

        const serviceCost = serviceCostResults[0].cost || 0;

        // Verifique se a exclusão do serviço não faz com que a soma dos custos dos serviços seja menor que zero
        if (totalCost - serviceCost < 0) {
          return res.status(400).json({ error: 'Exclusão do serviço resultaria em uma soma de custos menor que zero' });
        }

        // Execute a query para excluir o serviço do banco de dados
        connection.query('DELETE FROM services WHERE id = ?', [id], (error, deleteResults) => {
          if (error) {
            console.error('Erro ao excluir serviço:', error);
            return res.status(500).json({ error: 'Erro ao excluir serviço' });
          }

          console.log(`Serviço excluído com sucesso. ID do serviço: ${id}`);

          res.json({ message: 'Serviço excluído com sucesso', id });
        });
      });
    });
  });
});