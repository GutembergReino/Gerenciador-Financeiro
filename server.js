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
  password: 'gnrifpe',
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
  const { name, budget, category_id, project_services } = req.body;

  if (!name || !budget || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const project = { name, budget, category_id };

  connection.query('INSERT INTO projects SET ?', project, (error, results) => {
    if (error) {
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ error: 'Erro ao criar projeto' });
    } else {
      const projectId = results.insertId; // Obtém o ID do projeto recém-criado

      // Se houver serviços, adiciona-os à tabela de serviços vinculados ao projeto
      if (project_services && project_services.length > 0) {
        const serviceValues = project_services.map(service => [projectId, service.name, service.cost, service.description]);

        connection.query('INSERT INTO project_services (project_id, name, cost, description) VALUES ?', [serviceValues], (error, serviceResults) => {
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
  const projectId = req.params.id;

  connection.query('SELECT * FROM projects WHERE id = ?', [projectId], (error, results) => {
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

app.get('/project_services', (req, res) => {
  connection.query('SELECT * FROM project_services', (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços:', error);
      res.status(500).json({ error: 'Erro ao obter serviços' });
    } else {
      res.json(results);
    }
  });
});

app.post('/project_services', (req, res) => {
  const { name, cost, description } = req.body;

  if (!name || !cost || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes para o serviço' });
  }

  const service = { name, cost, description };

  connection.query('INSERT INTO project_services SET ?', service, (error, results) => {
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
  const projectId = req.params.id;

  connection.query('DELETE FROM projects WHERE id = ?', [projectId], (error, results) => {
    if (error) {
      console.error('Erro ao excluir projeto:', error);
      res.status(500).json({ error: 'Erro ao excluir projeto' });
    } else {
      res.json({ message: 'Projeto excluído com sucesso' });
    }
  });
});

app.put('/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const { name, budget, category_id } = req.body;

  if (!name || !budget || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const updatedProject = { name, budget, category_id };

  connection.query('UPDATE projects SET ? WHERE id = ?', [updatedProject, projectId], (error, results) => {
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

app.post('/project_services', (req, res) => {
  const { name, cost, description } = req.body;

  // Verifique se todos os campos necessários estão presentes
  if (!name || !cost || !description) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  // Crie um objeto representando o serviço
  const service = { name, cost, description };

  // Execute a query para inserir o serviço no banco de dados
  connection.query('INSERT INTO project_services SET ?', service, (error, results) => {
    if (error) {
      console.error('Erro ao criar serviço:', error);
      return res.status(500).json({ error: 'Erro ao criar serviço' });
    }

    res.json({ message: 'Serviço criado com sucesso', serviceId: results.insertId });
  });
});

app.get('/projects/:id', (req, res) => {
  const projectId = req.params.id;

  connection.query('SELECT * FROM project_services WHERE id_project = ?', [projectId], (error, results) => {
    if (error) {
      console.error('Erro ao obter serviços do projeto:', error);
      res.status(500).json({ error: 'Erro ao obter serviços do projeto' });
    } else {
      res.json(results);
    }
  });
});
