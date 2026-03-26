const {
  PutCommand,
  QueryCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("./dynamoService");
const { AUTOMATION_TABLE } = require("../utils/config");

function normalizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function createCountry(data) {
  const name = String(data.name || "").trim();
  const paisId = normalizeId(data.pais_id || data.country_id || name);

  if (!name) {
    throw new Error("El nombre del pais es obligatorio");
  }

  if (!paisId) {
    throw new Error("No se pudo generar el pais_id");
  }

  const item = {
    PK: "MASTER#PAIS",
    SK: `PAIS#${paisId}`,
    entityType: "MASTER_PAIS",
    pais_id: paisId,
    name,
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return item;
}

async function listCountries() {
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#PAIS",
        ":skPrefix": "PAIS#",
      },
    })
  );

  return response.Items || [];
}

async function deleteCountry(paisId) {
  const normalizedPaisId = normalizeId(paisId);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: "MASTER#PAIS",
        SK: `PAIS#${normalizedPaisId}`,
      },
    })
  );

  return {
    pais_id: normalizedPaisId,
  };
}

async function createCountryLabel(paisId, data) {
  const normalizedPaisId = normalizeId(paisId);
  const name = String(data.name || "").trim();
  const labelId = normalizeId(data.label_id || name);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  if (!name) {
    throw new Error("El nombre del label es obligatorio");
  }

  if (!labelId) {
    throw new Error("No se pudo generar el label_id");
  }

  const item = {
    PK: `MASTER#PAIS#${normalizedPaisId}`,
    SK: `LABEL#${labelId}`,
    entityType: "MASTER_PAIS_LABEL",
    pais_id: normalizedPaisId,
    label_id: labelId,
    name,
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return item;
}

async function listCountryLabels(paisId) {
  const normalizedPaisId = normalizeId(paisId);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `MASTER#PAIS#${normalizedPaisId}`,
        ":skPrefix": "LABEL#",
      },
    })
  );

  return response.Items || [];
}

async function deleteCountryLabel(paisId, labelId) {
  const normalizedPaisId = normalizeId(paisId);
  const normalizedLabelId = normalizeId(labelId);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  if (!normalizedLabelId) {
    throw new Error("El labelId es obligatorio");
  }

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: `MASTER#PAIS#${normalizedPaisId}`,
        SK: `LABEL#${normalizedLabelId}`,
      },
    })
  );

  return {
    pais_id: normalizedPaisId,
    label_id: normalizedLabelId,
  };
}

async function createCountryBusiness(paisId, labelId, data) {
  const normalizedPaisId = normalizeId(paisId);
  const normalizedLabelId = normalizeId(labelId);
  const name = String(data.name || "").trim();
  const negocioId = normalizeId(data.negocio_id || name);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  if (!normalizedLabelId) {
    throw new Error("El labelId es obligatorio");
  }

  if (!name) {
    throw new Error("El nombre del negocio es obligatorio");
  }

  if (!negocioId) {
    throw new Error("No se pudo generar el negocio_id");
  }

  const item = {
    PK: `MASTER#PAIS#${normalizedPaisId}#LABEL#${normalizedLabelId}`,
    SK: `NEGOCIO#${negocioId}`,
    entityType: "MASTER_PAIS_NEGOCIO",
    pais_id: normalizedPaisId,
    label_id: normalizedLabelId,
    negocio_id: negocioId,
    name,
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return item;
}

async function listCountryBusinesses(paisId, labelId) {
  const normalizedPaisId = normalizeId(paisId);
  const normalizedLabelId = normalizeId(labelId);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  if (!normalizedLabelId) {
    throw new Error("El labelId es obligatorio");
  }

  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": `MASTER#PAIS#${normalizedPaisId}#LABEL#${normalizedLabelId}`,
        ":skPrefix": "NEGOCIO#",
      },
    })
  );

  return response.Items || [];
}

async function deleteCountryBusiness(paisId, labelId, negocioId) {
  const normalizedPaisId = normalizeId(paisId);
  const normalizedLabelId = normalizeId(labelId);
  const normalizedNegocioId = normalizeId(negocioId);

  if (!normalizedPaisId) {
    throw new Error("El paisId es obligatorio");
  }

  if (!normalizedLabelId) {
    throw new Error("El labelId es obligatorio");
  }

  if (!normalizedNegocioId) {
    throw new Error("El negocioId es obligatorio");
  }

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: `MASTER#PAIS#${normalizedPaisId}#LABEL#${normalizedLabelId}`,
        SK: `NEGOCIO#${normalizedNegocioId}`,
      },
    })
  );

  return {
    pais_id: normalizedPaisId,
    label_id: normalizedLabelId,
    negocio_id: normalizedNegocioId,
  };
}

module.exports = {
  createCountry,
  listCountries,
  deleteCountry,
  createCountryLabel,
  listCountryLabels,
  deleteCountryLabel,
  createCountryBusiness,
  listCountryBusinesses,
  deleteCountryBusiness,
};