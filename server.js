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
  password: '',
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
  const { name, budget, category_id } = req.body;

  if (!name || !budget || !category_id) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
  }

  const project = { name, budget, category_id };

  connection.query('INSERT INTO projects SET ?', project, (error, results) => {
    if (error) {
      console.error('Erro ao criar projeto:', error);
      res.status(500).json({ error: 'Erro ao criar projeto' });
    } else {
      res.json({ message: 'Projeto criado com sucesso' });
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

app.get('/users', (req, res) => {
  connection.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Erro ao obter usuários:', error);
      res.status(500).json({ error: 'Erro ao obter usuários' });
    } else {
      res.json(results);
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