const {
  createBenefit,
  listBenefits,
  deleteBenefit,
} = require("../services/benefitService");
const { jsonResponse } = require("../utils/response");

async function listAll() {
  try {
    const items = await listBenefits();
    return jsonResponse(200, {
      message: "Beneficios obtenidos correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo beneficios",
      error: error.message,
    });
  }
}

async function create(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const item = await createBenefit(body);

    return jsonResponse(201, {
      message: "Beneficio creado correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando beneficio",
      error: error.message,
    });
  }
}

async function remove(event) {
  try {
    const beneficioId = event.pathParameters?.beneficioId;
    const result = await deleteBenefit(beneficioId);

    return jsonResponse(200, {
      message: "Beneficio eliminado correctamente",
      result,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error eliminando beneficio",
      error: error.message,
    });
  }
}

module.exports = {
  listAll,
  create,
  remove,
};