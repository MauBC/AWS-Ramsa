const {
  createCategory,
  listCategories,
  deleteCategory,
  createItem,
  listItemsByCategory,
  deleteItem,
  listPkTypes,
  listItemsByPk,
} = require("../services/masterService");
const { jsonResponse } = require("../utils/response");

async function createCategoryHandler(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const item = await createCategory(body);

    return jsonResponse(201, {
      message: "Categoria creada correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando categoria",
      error: error.message,
    });
  }
}

async function listCategoriesHandler() {
  try {
    const items = await listCategories();

    return jsonResponse(200, {
      message: "Categorias obtenidas correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo categorias",
      error: error.message,
    });
  }
}

async function deleteCategoryHandler(event) {
  try {
    const categoryId = event.pathParameters?.categoryId;
    const result = await deleteCategory(categoryId);

    return jsonResponse(200, {
      message: "Categoria eliminada correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando categoria",
      error: error.message,
    });
  }
}

async function createItemHandler(event) {
  try {
    const categoryId = event.pathParameters?.categoryId;
    const body = JSON.parse(event.body || "{}");
    const item = await createItem(categoryId, body);

    return jsonResponse(201, {
      message: "Item creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando item",
      error: error.message,
    });
  }
}

async function listItemsByCategoryHandler(event) {
  try {
    const categoryId = event.pathParameters?.categoryId;
    const items = await listItemsByCategory(categoryId);

    return jsonResponse(200, {
      message: "Items obtenidos correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo items",
      error: error.message,
    });
  }
}

async function deleteItemHandler(event) {
  try {
    const categoryId = event.pathParameters?.categoryId;
    const itemId = event.pathParameters?.itemId;
    const result = await deleteItem(categoryId, itemId);

    return jsonResponse(200, {
      message: "Item eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando item",
      error: error.message,
    });
  }
}

async function listPkTypesHandler() {
  try {
    const pkTypes = await listPkTypes();

    return jsonResponse(200, {
      message: "PKs obtenidos correctamente",
      count: pkTypes.length,
      pk_types: pkTypes,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo PKs",
      error: error.message,
    });
  }
}

async function listItemsByPkHandler(event) {
  try {
    const pk = event.queryStringParameters?.pk;
    const items = await listItemsByPk(pk);

    return jsonResponse(200, {
      message: "Items obtenidos correctamente por PK",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo items por PK",
      error: error.message,
    });
  }
}

module.exports = {
  createCategory: createCategoryHandler,
  listCategories: listCategoriesHandler,
  deleteCategory: deleteCategoryHandler,
  createItem: createItemHandler,
  listItemsByCategory: listItemsByCategoryHandler,
  deleteItem: deleteItemHandler,
  listPkTypes: listPkTypesHandler,
  listItemsByPk: listItemsByPkHandler,
};