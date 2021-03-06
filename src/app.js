const express          = require('express');
const cors             = require("cors");
const { v4, validate } = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

const validateRequestParams = (request, response, next) => {
  const { id } = request.params;

  if (id === "" || id === undefined) {
      return response.status(400).json({
          "error": "The 'id' param is required",
      });
  }

  if (!validate(id)) {
      return response.status(400).json({
          "error": "The 'id' param is invalid",
      });
  }

  next();
}

const validateRequestBody = (request, response, next) => {
  const { title, url, techs } = request.body;

  if (title === "" || title === undefined) {
      return response.status(400).json({
          "error": "The 'title' param is required",
      });
  }

  if (url === "" || url === undefined) {
      return response.status(400).json({
          "error": "The 'url' param is required",
      });
  }

  if (techs === undefined || techs.length < 1) {
      return response.status(400).json({
          "error": "The 'techs' param is required",
      });
  }

  if (!Array.isArray(techs)) {
      return response.status(400).json({
          "error": "The 'techs' param must be an Array of strings",
      });
  }

  next();
}

const logRequests = (request, response, next) => {
  const { method, url } = request;
  console.log(`[${method.toUpperCase()}] ${url}`);
  next();
}
app.use(logRequests);

// Retorna todos os repositórios
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

// Retorna um repositório
app.get('/repositories/:id', validateRequestParams, function(request, response) {
    const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({
            error: `Project '${id}' could not found`,
        });
    }

    const repository = repositories[repositoryIndex];

    return response.json(repository);
});

// Cria um novo repositório
app.post('/repositories/', validateRequestBody, (request, response) => {
  const { title, url, techs } = request.body;
    const newProject = {
        id: v4(),
        title,
        url,
        techs,
        likes: 0,
    };
    repositories.push(newProject);

    return response.json(newProject);
});

// Atualiza um repositório
app.put('/repositories/:id', validateRequestParams, (request, response) => {
  const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({
            error: `Project '${id}' could not found`,
        });
    }

    const { likes } = repositories[repositoryIndex];
    const { title, url, techs } = request.body;
    const newProject = {
        id,
        title,
        url,
        techs,
        likes,
    };

    repositories[repositoryIndex] = newProject;

    return response.json(newProject);
});

// Exclui um repositório
app.delete('/repositories/:id', validateRequestParams, (request, response) => {
  const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({
            error: `Project '${id}' could not found`,
        });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

// Curte um repositório
app.post('/repositories/:id/like', validateRequestParams,(request, response) => {
  const { id } = request.params;
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);
    if (repositoryIndex < 0) {
        return response.status(400).json({
            error: `Project '${id}' could not found`,
        });
    }

    repositories[repositoryIndex].likes += 1;

    return response.json(repositories[repositoryIndex]);
});

module.exports = app;
