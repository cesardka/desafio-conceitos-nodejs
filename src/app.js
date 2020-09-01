const express = require('express');
const cors    = require("cors");
const { v4 }  = require('uuid');

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

const logRequests = (request, response, next) => {
  const { method, url } = request;
  console.log(`[${method.toUpperCase()}] ${url}`);
  next();
}
app.use(logRequests);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
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

app.put("/repositories/:id", (request, response) => {
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

app.delete("/repositories/:id", (request, response) => {
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

app.post("/repositories/:id/like", (request, response) => {
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
