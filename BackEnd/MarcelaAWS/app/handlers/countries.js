const {
  createCountry,
  listCountries,
  deleteCountry,
  createCountryLabel,
  listCountryLabels,
  deleteCountryLabel,
  createCountryBusiness,
  listCountryBusinesses,
  deleteCountryBusiness,
} = require("../services/countryService");
const { jsonResponse } = require("../utils/response");

async function listAll() {
  try {
    const items = await listCountries();

    return jsonResponse(200, {
      message: "Paises obtenidos correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo paises",
      error: error.message,
    });
  }
}

async function create(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const item = await createCountry(body);

    return jsonResponse(201, {
      message: "Pais creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando pais",
      error: error.message,
    });
  }
}

async function remove(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const result = await deleteCountry(paisId);

    return jsonResponse(200, {
      message: "Pais eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando pais",
      error: error.message,
    });
  }
}

async function listLabels(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const items = await listCountryLabels(paisId);

    return jsonResponse(200, {
      message: "Labels obtenidos correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo labels",
      error: error.message,
    });
  }
}

async function createLabel(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const body = JSON.parse(event.body || "{}");
    const item = await createCountryLabel(paisId, body);

    return jsonResponse(201, {
      message: "Label creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando label",
      error: error.message,
    });
  }
}

async function removeLabel(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const labelId = event.pathParameters?.labelId;
    const result = await deleteCountryLabel(paisId, labelId);

    return jsonResponse(200, {
      message: "Label eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando label",
      error: error.message,
    });
  }
}

async function listBusinesses(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const labelId = event.pathParameters?.labelId;
    const items = await listCountryBusinesses(paisId, labelId);

    return jsonResponse(200, {
      message: "Negocios obtenidos correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo negocios",
      error: error.message,
    });
  }
}

async function createBusiness(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const labelId = event.pathParameters?.labelId;
    const body = JSON.parse(event.body || "{}");
    const item = await createCountryBusiness(paisId, labelId, body);

    return jsonResponse(201, {
      message: "Negocio creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando negocio",
      error: error.message,
    });
  }
}

async function removeBusiness(event) {
  try {
    const paisId = event.pathParameters?.paisId;
    const labelId = event.pathParameters?.labelId;
    const negocioId = event.pathParameters?.negocioId;
    const result = await deleteCountryBusiness(paisId, labelId, negocioId);

    return jsonResponse(200, {
      message: "Negocio eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando negocio",
      error: error.message,
    });
  }
}

module.exports = {
  listAll,
  create,
  remove,
  listLabels,
  createLabel,
  removeLabel,
  listBusinesses,
  createBusiness,
  removeBusiness,
};