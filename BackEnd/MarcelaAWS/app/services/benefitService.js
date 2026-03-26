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

async function createBenefit(data) {
  const name = String(data.name || "").trim();
  const beneficioId = normalizeId(data.beneficio_id || name);

  if (!name) throw new Error("El nombre del beneficio es obligatorio");
  if (!beneficioId) throw new Error("No se pudo generar el beneficio_id");

  const item = {
    PK: "MASTER#BENEFICIO",
    SK: `BEN#${beneficioId}`,
    entityType: "MASTER_BENEFICIO",
    beneficio_id: beneficioId,
    name,
    default_value: data.default_value ?? null,
    default_unit: data.default_unit || "",
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
    })
  );

  return item;
}

async function listBenefits() {
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#BENEFICIO",
        ":skPrefix": "BEN#",
      },
    })
  );

  return response.Items || [];
}

async function deleteBenefit(beneficioId) {
  const id = normalizeId(beneficioId);

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: "MASTER#BENEFICIO",
        SK: `BEN#${id}`,
      },
    })
  );

  return { beneficio_id: id };
}

module.exports = {
  createBenefit,
  listBenefits,
  deleteBenefit,
};