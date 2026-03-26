const {
  createCatalogItem,
  listCatalogItems,
  deleteCatalogItem,
} = require("../services/catalogService");
const { jsonResponse } = require("../utils/response");

async function listAll() {
  try {
    const items = await listCatalogItems();
    return jsonResponse(200, {
      message: "Catalogo obtenido correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo catalogo",
      error: error.message,
    });
  }
}

async function create(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const item = await createCatalogItem(body);

    return jsonResponse(201, {
      message: "Item de catalogo creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando item de catalogo",
      error: error.message,
    });
  }
}

async function remove(event) {
  try {
    const catalogoId = event.pathParameters?.catalogoId;
    const result = await deleteCatalogItem(catalogoId);

    return jsonResponse(200, {
      message: "Item de catalogo eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando item de catalogo",
      error: error.message,
    });
  }
}

module.exports = {
  listAll,
  create,
  remove,
};