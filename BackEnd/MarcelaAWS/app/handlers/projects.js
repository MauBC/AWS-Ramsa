const {
  listProjects,
  createProject,
} = require("../services/projectService");
const { jsonResponse } = require("../utils/response");

async function listProjectsHandler(event, context) {
  try {
    const items = await listProjects();

    return jsonResponse(200, {
      message: "Lista de proyectos obtenida correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo proyectos",
      error: error.message,
    });
  }
}

async function createProjectHandler(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");

    const title = body.title;

    if (!title) {
      return jsonResponse(400, {
        message: "El campo 'title' es obligatorio",
      });
    }

    const item = await createProject(body);

    return jsonResponse(201, {
      message: "Proyecto creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando proyecto",
      error: error.message,
    });
  }
}

module.exports = {
  listProjects: listProjectsHandler,
  createProject: createProjectHandler,
};