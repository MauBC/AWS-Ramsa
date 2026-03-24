const {
  createRequest,
  listRequests,
} = require("../services/requestService");
const { jsonResponse } = require("../utils/response");

const REQUIRED_FIELDS = [
  "nombre_proy",
  "nombre_proy_abs",
  "tipo_solicitud",
  "presupuesto",
  "area",
  "nombre_persona",
  "correo",
  "key_user",
  "tipo_beneficio",
  "valor_beneficio",
  "tipo_valor",
  "sustento",
  "numero_paso",
  "descripcion_paso",
  "documento",
];

async function create(event, context) {
  try {
    const body = JSON.parse(event.body || "{}");

    const missingFields = REQUIRED_FIELDS.filter((field) => {
      const value = body[field];
      return value === undefined || value === null || value === "";
    });

    if (missingFields.length > 0) {
      return jsonResponse(400, {
        message: "Faltan campos obligatorios",
        missing_fields: missingFields,
      });
    }

    const item = await createRequest(body);

    return jsonResponse(201, {
      message: "Peticion creada correctamente",
      item,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error creando peticion",
      error: error.message,
    });
  }
}

async function listAll(event, context) {
  try {
    const items = await listRequests();

    return jsonResponse(200, {
      message: "Peticiones obtenidas correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error obteniendo peticiones",
      error: error.message,
    });
  }
}

module.exports = {
  create,
  listAll,
};