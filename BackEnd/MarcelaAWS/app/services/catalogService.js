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

async function createCatalogItem(data) {
  const name = String(data.name || "").trim();
  const catalogoId = normalizeId(data.catalogo_id || name);

  if (!name) {
    throw new Error("El nombre del catalogo es obligatorio");
  }

  if (!catalogoId) {
    throw new Error("No se pudo generar el catalogo_id");
  }

  const item = {
    PK: "MASTER#CATALOGO",
    SK: `CAT#${catalogoId}`,
    entityType: "MASTER_CATALOGO",
    catalogo_id: catalogoId,
    name,
    description: data.description || "",
    image_url: data.image_url || "",
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

async function listCatalogItems() {
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#CATALOGO",
        ":skPrefix": "CAT#",
      },
    })
  );

  return response.Items || [];
}

async function deleteCatalogItem(catalogoId) {
  const id = normalizeId(catalogoId);

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: "MASTER#CATALOGO",
        SK: `CAT#${id}`,
      },
    })
  );

  return { catalogo_id: id };
}

module.exports = {
  createCatalogItem,
  listCatalogItems,
  deleteCatalogItem,
};